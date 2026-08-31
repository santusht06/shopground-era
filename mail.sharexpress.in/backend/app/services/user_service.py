"""UserService manages email account creation, deletion, password updates, and storage quotas."""
import logging
import random
from datetime import datetime, timezone
from motor.motor_asyncio import AsyncIOMotorDatabase
from bson import ObjectId
from fastapi import HTTPException, status

from app.models.user import UserCreate, UserUpdate
from app.core.security import hash_password

logger = logging.getLogger(__name__)

# Warm, aesthetic colors for default user avatars
AVATAR_COLORS = [
    "#3b82f6", "#10b981", "#8b5cf6", "#f59e0b", "#ec4899",
    "#ef4444", "#06b6d4", "#14b8a6", "#6366f1", "#a855f7"
]

class UserService:
    @staticmethod
    async def create_user(db: AsyncIOMotorDatabase, req: UserCreate) -> dict:
        """Create a new user mailbox."""
        # Check if already exists
        existing = await db.users.find_one({"email": req.email})
        if existing:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Mailbox {req.email} already exists."
            )

        username = req.email.split("@")[0]
        
        user_doc = {
            "email": req.email,
            "username": username,
            "display_name": req.display_name,
            "role": req.role,
            "hashed_password": hash_password(req.password),
            "disabled": False,
            "storage_quota_mb": 1024,
            "storage_used_mb": 0.0,
            "avatar_color": random.choice(AVATAR_COLORS),
            "created_at": datetime.now(timezone.utc),
            "last_login": None
        }

        res = await db.users.insert_one(user_doc)
        user_doc["_id"] = res.inserted_id
        return user_doc

    @staticmethod
    async def update_user(db: AsyncIOMotorDatabase, user_id: str, req: UserUpdate) -> dict:
        """Update mailbox configuration or change password."""
        user = await db.users.find_one({"_id": ObjectId(user_id)})
        if not user:
            raise HTTPException(status_code=404, detail="Mailbox not found")

        update_fields = {}
        if req.display_name is not None:
            update_fields["display_name"] = req.display_name
        if req.disabled is not None:
            update_fields["disabled"] = req.disabled
        if req.storage_quota_mb is not None:
            update_fields["storage_quota_mb"] = req.storage_quota_mb
        if req.password is not None:
            update_fields["hashed_password"] = hash_password(req.password)

        if update_fields:
            await db.users.update_one(
                {"_id": ObjectId(user_id)},
                {"$set": update_fields}
            )
            # Fetch fresh copy
            user = await db.users.find_one({"_id": ObjectId(user_id)})

        return user

    @staticmethod
    async def delete_user(db: AsyncIOMotorDatabase, user_id: str) -> bool:
        """Delete mailbox profile and all associated emails."""
        user = await db.users.find_one({"_id": ObjectId(user_id)})
        if not user:
            raise HTTPException(status_code=404, detail="Mailbox not found")

        # Delete all emails belonging to this user
        await db.emails.delete_many({"owner": user["email"]})
        
        # Delete user
        res = await db.users.delete_one({"_id": ObjectId(user_id)})
        return res.deleted_count > 0
