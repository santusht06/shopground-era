"""
Startup seed script — creates initial admin account if it doesn't exist.
Called by FastAPI lifespan on startup.
"""
import logging
from datetime import datetime, timezone
from app.database import get_db
from app.core.security import hash_password
from app.config import settings

logger = logging.getLogger(__name__)

AVATAR_COLORS = ["#3b82f6", "#10b981", "#8b5cf6", "#f59e0b", "#ec4899"]


async def seed_admin():
    """Create the default admin mailbox on first run."""
    db = get_db()

    existing = await db.users.find_one({"email": settings.ADMIN_EMAIL})
    if existing:
        logger.info("Admin account already exists: %s", settings.ADMIN_EMAIL)
        return

    username = settings.ADMIN_EMAIL.split("@")[0]
    admin_doc = {
        "email": settings.ADMIN_EMAIL,
        "username": username,
        "display_name": "Santusht Kotai",
        "role": "admin",
        "hashed_password": hash_password(settings.ADMIN_PASSWORD),
        "disabled": False,
        "storage_quota_mb": 10240,  # 10 GB for admin
        "storage_used_mb": 0.0,
        "avatar_color": "#3b82f6",
        "created_at": datetime.now(timezone.utc),
        "last_login": None,
    }

    await db.users.insert_one(admin_doc)
    logger.info("✅ Admin account seeded: %s", settings.ADMIN_EMAIL)

    # Also seed common mailboxes
    default_mailboxes = [
        {"email": f"support@{settings.MAIL_DOMAIN}", "display_name": "Support Team", "role": "user"},
        {"email": f"hr@{settings.MAIL_DOMAIN}", "display_name": "HR Office", "role": "user"},
        {"email": f"noreply@{settings.MAIL_DOMAIN}", "display_name": "No Reply", "role": "user"},
    ]

    for mb in default_mailboxes:
        exists = await db.users.find_one({"email": mb["email"]})
        if not exists:
            mb_username = mb["email"].split("@")[0]
            await db.users.insert_one({
                "email": mb["email"],
                "username": mb_username,
                "display_name": mb["display_name"],
                "role": mb["role"],
                "hashed_password": hash_password(f"{mb_username.capitalize()}Pass123!"),
                "disabled": False,
                "storage_quota_mb": 2048,
                "storage_used_mb": 0.0,
                "avatar_color": AVATAR_COLORS[hash(mb["email"]) % len(AVATAR_COLORS)],
                "created_at": datetime.now(timezone.utc),
                "last_login": None,
            })
            logger.info("✅ Seeded mailbox: %s", mb["email"])
