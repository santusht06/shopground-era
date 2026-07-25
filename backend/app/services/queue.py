import json
from datetime import datetime
from typing import Dict, Any, Optional
from app.core.redis import get_redis_client

EMAIL_QUEUE_KEY = "shopground:email_queue"

async def enqueue_email_task(
    to_email: str,
    subject: str,
    template: str,
    context: Dict[str, Any]
) -> bool:
    """
    Push an email dispatch payload onto the Redis asynchronous task queue.
    Prevents API requests from blocking during external SMTP/Email sending.
    """
    redis = get_redis_client()
    task_payload = {
        "to_email": to_email,
        "subject": subject,
        "template": template,
        "context": context,
        "enqueued_at": datetime.utcnow().isoformat(),
        "status": "QUEUED"
    }

    if redis:
        try:
            await redis.rpush(EMAIL_QUEUE_KEY, json.dumps(task_payload))
            print(f" [Redis Queue] Enqueued email task to {to_email} ({template})")
            return True
        except Exception as e:
            print(f" [Redis Queue Error] Failed to rpush email task: {e}")
    
    # Fallback log if Redis client is offline
    print(f" [Email Fallback Log] Simulating dispatch to {to_email}: {subject}")
    return False

async def get_queue_length() -> int:
    """Return total pending tasks in Redis email queue."""
    redis = get_redis_client()
    if redis:
        try:
            return await redis.llen(EMAIL_QUEUE_KEY)
        except Exception:
            return 0
    return 0
