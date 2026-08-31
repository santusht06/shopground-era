"""MongoDB async connection using Motor with production connection pooling."""
import logging
from motor.motor_asyncio import AsyncIOMotorClient, AsyncIOMotorDatabase

from app.config import settings

logger = logging.getLogger(__name__)

_client: AsyncIOMotorClient | None = None
_db: AsyncIOMotorDatabase | None = None


async def connect_db():
    global _client, _db
    logger.info("Connecting to MongoDB at %s", settings.MONGO_URI)

    # Production connection pool settings
    _client = AsyncIOMotorClient(
        settings.MONGO_URI,
        # Connection pool
        minPoolSize=5,
        maxPoolSize=50,
        maxIdleTimeMS=30000,         # Close idle connections after 30s
        waitQueueTimeoutMS=5000,     # Wait max 5s for a connection from pool
        connectTimeoutMS=5000,       # TCP connect timeout
        serverSelectionTimeoutMS=10000,  # Replica set election timeout
        socketTimeoutMS=30000,       # Socket operation timeout
        # Heartbeat
        heartbeatFrequencyMS=10000,  # Check server every 10s
        # Write concern: majority for production durability
        w="majority",
        journal=True,                # Wait for journal flush
        # Read preference: nearest for read performance
        readPreference="nearest",
        # Retry
        retryWrites=True,
        retryReads=True,
        # App name for monitoring
        appName="mail.sharexpress.in",
    )
    _db = _client[settings.MONGO_DB]

    # Verify connection is live
    await _client.admin.command("ping")
    logger.info("✅ MongoDB connected — database: %s | pool: 5-50 connections", settings.MONGO_DB)

    await _create_indexes()


async def close_db():
    global _client
    if _client:
        _client.close()
        logger.info("MongoDB connection closed")


def get_db() -> AsyncIOMotorDatabase:
    if _db is None:
        raise RuntimeError("Database not connected. Call connect_db() first.")
    return _db


async def _create_indexes():
    """Create all necessary MongoDB indexes on startup for query performance."""
    db = get_db()

    # Users
    await db.users.create_index("email", unique=True)
    await db.users.create_index("username", unique=True)
    await db.users.create_index("role")

    # Emails — primary inbox query patterns
    await db.emails.create_index([("owner", 1), ("folder", 1), ("date", -1)])
    await db.emails.create_index([("owner", 1), ("read", 1), ("folder", 1)])
    await db.emails.create_index([("owner", 1), ("starred", 1)])
    await db.emails.create_index([("message_id", 1)], unique=True, sparse=True)
    # Full-text search index
    await db.emails.create_index(
        [("subject", "text"), ("body_text", "text"), ("from_address", "text")],
        weights={"subject": 10, "body_text": 5, "from_address": 3},
        name="email_fulltext"
    )
    # TTL index on trash folder (auto-purge after 30 days)
    # Note: date field is set to email's original date, not created_at
    # We handle trash cleanup in Celery nightly job instead.

    # Sessions — TTL on expires_at
    await db.sessions.create_index("token", unique=True)
    await db.sessions.create_index("expires_at", expireAfterSeconds=0)
    await db.sessions.create_index("email")

    # Email queue (retry system)
    await db.email_queue.create_index([("status", 1), ("retry_at", 1)])

    # Dead letter queue
    await db.email_dlq.create_index([("created_at", -1)])
    await db.email_dlq.create_index("status")

    # Audit logs
    await db.audit_logs.create_index([("user_id", 1), ("created_at", -1)])
    await db.audit_logs.create_index("created_at", expireAfterSeconds=7776000)  # 90 days

    logger.info("✅ MongoDB indexes created/verified")
