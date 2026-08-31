"""
Celery Mail Worker — Production Queue System
==============================================
Queue Architecture:
  mail_high   → Priority emails: password reset, OTPs, critical alerts
  mail_normal → Compose/send emails from webmail
  mail_bulk   → Campaign/batch emails (rate limited)
  mail_retry  → Failed emails pending exponential backoff retry
  mail_dlq    → Dead Letter Queue — permanently failed (admin review)

Routing:
  - Each queue maps to a RabbitMQ exchange with appropriate QoS
  - Priority emails skip the rate limit
  - DLQ entries are stored in MongoDB for audit

Retry Strategy:
  - Attempt 1 → immediate
  - Attempt 2 → 30s delay
  - Attempt 3 → 5m delay
  - Attempt 4 → 30m delay
  - Attempt 5 → 2h delay
  - After 5 failures → moved to DLQ
"""
import os
import asyncio
import logging
from datetime import datetime, timezone, timedelta
from celery import Celery
from celery.schedules import crontab
from kombu import Queue, Exchange

logger = logging.getLogger(__name__)

# ─── Celery Application Setup ─────────────────────────────────────────────────
REDIS_URL = os.getenv("REDIS_URL", "redis://redis:6379/0")
RABBITMQ_URL = os.getenv("RABBITMQ_URL", "amqp://mail:mailpassword@rabbitmq:5672/")

app = Celery("mail_worker", broker=RABBITMQ_URL, backend=REDIS_URL)

# ─── Queue & Exchange Definitions ────────────────────────────────────────────
default_exchange   = Exchange("mail", type="direct")
priority_exchange  = Exchange("mail.priority", type="direct")
bulk_exchange      = Exchange("mail.bulk", type="direct")
dlq_exchange       = Exchange("mail.dlq", type="fanout")

QUEUES = (
    # Priority queue: no rate limiting, processed first
    Queue("mail_high",   exchange=priority_exchange, routing_key="mail.high",
          queue_arguments={"x-max-priority": 10, "x-message-ttl": 3600000}),
    # Normal queue: standard transactional mail from webmail
    Queue("mail_normal", exchange=default_exchange,  routing_key="mail.normal",
          queue_arguments={"x-max-priority": 5}),
    # Bulk queue: campaigns/batch, rate limited, lower concurrency
    Queue("mail_bulk",   exchange=bulk_exchange,     routing_key="mail.bulk",
          queue_arguments={"x-max-priority": 1, "x-message-ttl": 86400000}),
    # Retry queue: failed emails waiting for backoff
    Queue("mail_retry",  exchange=default_exchange,  routing_key="mail.retry"),
    # Dead letter queue: permanently failed, admin review
    Queue("mail_dlq",    exchange=dlq_exchange,      routing_key="",
          queue_arguments={"x-message-ttl": 2592000000}),  # 30 days TTL
)

# ─── Celery Configuration ─────────────────────────────────────────────────────
app.conf.update(
    # Serialization
    task_serializer="json",
    result_serializer="json",
    accept_content=["json"],
    
    # Timezone
    timezone="UTC",
    enable_utc=True,

    # Queue definitions
    task_queues=QUEUES,
    task_default_queue="mail_normal",
    task_default_exchange="mail",
    task_default_routing_key="mail.normal",

    # Task routing
    task_routes={
        "app.workers.mail_worker.send_high_priority": {
            "queue": "mail_high",
            "routing_key": "mail.high"
        },
        "app.workers.mail_worker.send_normal_email": {
            "queue": "mail_normal",
            "routing_key": "mail.normal"
        },
        "app.workers.mail_worker.send_bulk_email": {
            "queue": "mail_bulk",
            "routing_key": "mail.bulk"
        },
        "app.workers.mail_worker.nightly_cleanup": {
            "queue": "mail_normal"
        },
    },

    # Worker concurrency: mail_high/normal = 8 workers, mail_bulk = 2 workers
    worker_prefetch_multiplier=1,  # CRITICAL: fair dispatch, prevent starvation
    task_acks_late=True,           # Ack AFTER task completes (no lost tasks)
    task_reject_on_worker_lost=True,

    # Result backend
    result_expires=3600,  # Results expire after 1 hour

    # Rate limiting on bulk queue
    task_annotations={
        "app.workers.mail_worker.send_bulk_email": {
            "rate_limit": "30/m"  # Max 30 bulk emails/minute (stay under Spamhaus limits)
        }
    },
)

# ─── Periodic Tasks Schedule ─────────────────────────────────────────────────
@app.on_after_configure.connect
def setup_periodic_tasks(sender, **kwargs):
    # Nightly cleanup — 2:00 AM UTC
    sender.add_periodic_task(
        crontab(hour=2, minute=0),
        nightly_cleanup.s(),
        name="nightly-db-cleanup"
    )
    # Process retry queue — every 10 minutes
    sender.add_periodic_task(
        crontab(minute="*/10"),
        process_retry_queue.s(),
        name="retry-queue-processor"
    )


# ─── Retry Backoff Schedule ───────────────────────────────────────────────────
RETRY_DELAYS = [30, 300, 1800, 7200, 86400]  # 30s, 5m, 30m, 2h, 24h

def _run_async(coro):
    """Run async coroutine in Celery sync context."""
    try:
        loop = asyncio.get_event_loop()
        if loop.is_closed():
            raise RuntimeError("closed")
    except RuntimeError:
        loop = asyncio.new_event_loop()
        asyncio.set_event_loop(loop)
    return loop.run_until_complete(coro)


# ─── Task: High Priority Email (OTP, Password Reset, Alerts) ─────────────────
@app.task(
    name="app.workers.mail_worker.send_high_priority",
    bind=True,
    max_retries=5,
    acks_late=True,
    queue="mail_high",
)
def send_high_priority(self, from_address, to_addresses, subject, body_html,
                        body_text=None, cc=None, bcc=None, attempt=0):
    """High-priority email — skips rate limiting, maximum 5 immediate retries."""
    from app.services.smtp_service import SMTPService
    logger.info("[QUEUE:HIGH] Sending '%s' to %s (attempt %d)", subject, to_addresses, attempt + 1)

    try:
        success = _run_async(SMTPService.send_email(
            from_address=from_address,
            to_addresses=to_addresses,
            subject=subject,
            body_html=body_html,
            body_text=body_text,
            cc=cc,
            bcc=bcc,
            max_retries=1,  # SMTP internal retries
        ))
        if not success:
            raise ValueError("SMTP rejected delivery")
        logger.info("[QUEUE:HIGH] ✅ Delivered '%s'", subject)
        return {"status": "delivered", "to": to_addresses}

    except Exception as exc:
        delay = RETRY_DELAYS[min(attempt, len(RETRY_DELAYS) - 1)]
        if attempt >= 4:
            _move_to_dlq(from_address, to_addresses, subject, body_html, reason=str(exc))
            return {"status": "dlq", "reason": str(exc)}
        logger.warning("[QUEUE:HIGH] ⚠️ Attempt %d failed: %s. Retry in %ds", attempt + 1, exc, delay)
        raise self.retry(exc=exc, countdown=delay, kwargs={**self.request.kwargs, "attempt": attempt + 1})


# ─── Task: Normal Email (Compose/Send from webmail) ──────────────────────────
@app.task(
    name="app.workers.mail_worker.send_normal_email",
    bind=True,
    max_retries=5,
    acks_late=True,
    queue="mail_normal",
)
def send_normal_email(self, from_address, to_addresses, subject, body_html,
                       body_text=None, cc=None, bcc=None, attempt=0):
    """Standard email send — exponential backoff retries, DLQ on permanent failure."""
    from app.services.smtp_service import SMTPService
    logger.info("[QUEUE:NORMAL] Sending '%s' to %s (attempt %d)", subject, to_addresses, attempt + 1)

    try:
        success = _run_async(SMTPService.send_email(
            from_address=from_address,
            to_addresses=to_addresses,
            subject=subject,
            body_html=body_html,
            body_text=body_text,
            cc=cc,
            bcc=bcc,
            max_retries=1,
        ))
        if not success:
            raise ValueError("SMTP rejected delivery")
        logger.info("[QUEUE:NORMAL] ✅ Delivered '%s'", subject)
        return {"status": "delivered", "to": to_addresses}

    except Exception as exc:
        delay = RETRY_DELAYS[min(attempt, len(RETRY_DELAYS) - 1)]
        if attempt >= 4:
            _move_to_dlq(from_address, to_addresses, subject, body_html, reason=str(exc))
            return {"status": "dlq", "reason": str(exc)}
        logger.warning("[QUEUE:NORMAL] ⚠️ Attempt %d failed: %s. Retry in %ds", attempt + 1, exc, delay)
        raise self.retry(exc=exc, countdown=delay, kwargs={**self.request.kwargs, "attempt": attempt + 1})


# ─── Task: Bulk Email (Campaigns — rate limited to 30/min) ───────────────────
@app.task(
    name="app.workers.mail_worker.send_bulk_email",
    bind=True,
    max_retries=3,
    acks_late=True,
    queue="mail_bulk",
    rate_limit="30/m",
)
def send_bulk_email(self, from_address, to_address, subject, body_html,
                     body_text=None, attempt=0):
    """
    Single-recipient bulk send (1 task per recipient for proper rate limiting).
    Use this for campaign emails — rate limited to 30/minute.
    """
    from app.services.smtp_service import SMTPService
    logger.info("[QUEUE:BULK] Sending bulk '%s' to %s", subject, to_address)

    try:
        success = _run_async(SMTPService.send_email(
            from_address=from_address,
            to_addresses=[to_address],
            subject=subject,
            body_html=body_html,
            body_text=body_text,
            max_retries=1,
        ))
        if not success:
            raise ValueError("SMTP rejected delivery")
        return {"status": "delivered", "to": to_address}

    except Exception as exc:
        delay = RETRY_DELAYS[min(attempt, len(RETRY_DELAYS) - 1)]
        if attempt >= 2:
            _move_to_dlq(from_address, [to_address], subject, body_html, reason=str(exc))
            return {"status": "dlq", "reason": str(exc)}
        raise self.retry(exc=exc, countdown=delay, kwargs={**self.request.kwargs, "attempt": attempt + 1})


# ─── Periodic: Process Retry Queue ───────────────────────────────────────────
@app.task(name="app.workers.mail_worker.process_retry_queue")
def process_retry_queue():
    """Scan MongoDB for emails stuck in 'pending_retry' state and re-queue them."""
    from app.config import settings
    from motor.motor_asyncio import AsyncIOMotorClient

    async def _run():
        client = AsyncIOMotorClient(settings.MONGO_URI)
        db = client[settings.MONGO_DB]
        now = datetime.now(timezone.utc)

        # Find emails scheduled for retry
        pending = await db.email_queue.find({
            "status": "pending_retry",
            "retry_at": {"$lte": now}
        }).to_list(length=100)

        count = 0
        for item in pending:
            send_normal_email.apply_async(kwargs={
                "from_address": item["from_address"],
                "to_addresses": item["to_addresses"],
                "subject": item["subject"],
                "body_html": item["body_html"],
                "attempt": item.get("attempts", 0),
            })
            await db.email_queue.delete_one({"_id": item["_id"]})
            count += 1

        client.close()
        return count

    count = _run_async(_run())
    logger.info("[RETRY] Re-queued %d pending emails.", count)
    return count


# ─── Periodic: Nightly Cleanup ───────────────────────────────────────────────
@app.task(name="app.workers.mail_worker.nightly_cleanup")
def nightly_cleanup():
    """
    Nightly maintenance:
    - Purge Trash emails older than 30 days
    - Remove expired sessions
    - Archive DLQ entries older than 30 days
    """
    from app.config import settings
    from motor.motor_asyncio import AsyncIOMotorClient

    async def _run():
        client = AsyncIOMotorClient(settings.MONGO_URI)
        db = client[settings.MONGO_DB]
        now = datetime.now(timezone.utc)
        thirty_days_ago = now - timedelta(days=30)
        one_day_ago = now - timedelta(days=1)

        # Purge Trash
        trash_res = await db.emails.delete_many({
            "folder": "trash",
            "date": {"$lt": thirty_days_ago}
        })

        # Clear expired sessions
        sess_res = await db.sessions.delete_many({"expires_at": {"$lt": now}})

        # Archive old DLQ items (move to audit log)
        dlq_items = await db.email_dlq.find(
            {"created_at": {"$lt": thirty_days_ago}}
        ).to_list(length=1000)

        if dlq_items:
            await db.email_audit.insert_many(dlq_items)
            await db.email_dlq.delete_many({"created_at": {"$lt": thirty_days_ago}})

        client.close()
        return {
            "trash_purged": trash_res.deleted_count,
            "sessions_purged": sess_res.deleted_count,
            "dlq_archived": len(dlq_items),
        }

    result = _run_async(_run())
    logger.info("[CLEANUP] %s", result)
    return result


# ─── Internal: Move to Dead Letter Queue ─────────────────────────────────────
def _move_to_dlq(from_address, to_addresses, subject, body_html, reason="Unknown"):
    """Store permanently failed email in MongoDB DLQ for admin review."""
    from app.config import settings
    from motor.motor_asyncio import AsyncIOMotorClient

    async def _run():
        client = AsyncIOMotorClient(settings.MONGO_URI)
        db = client[settings.MONGO_DB]
        await db.email_dlq.insert_one({
            "from_address": from_address,
            "to_addresses": to_addresses,
            "subject": subject,
            "body_html": body_html,
            "failure_reason": reason,
            "created_at": datetime.now(timezone.utc),
            "status": "dead",
        })
        client.close()

    _run_async(_run())
    logger.error(
        "[DLQ] ❌ Email permanently failed. Moved to DLQ — from=%s to=%s subject='%s' reason=%s",
        from_address, to_addresses, subject, reason
    )
