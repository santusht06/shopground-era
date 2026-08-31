"""AuthService handles user login, password verification, refresh tokens, and session management."""
import logging
from datetime import datetime, timezone, timedelta
from fastapi import HTTPException, status
from motor.motor_asyncio import AsyncIOMotorDatabase
from bson import ObjectId

from app.core.security import verify_password, create_access_token, create_refresh_token, verify_refresh_token
from app.models.user import LoginRequest, TokenResponse, UserOut

logger = logging.getLogger(__name__)

class AuthService:
    @staticmethod
    async def authenticate_user(db: AsyncIOMotorDatabase, login_req: LoginRequest) -> TokenResponse:
        """Authenticate user by email and return JWT access/refresh tokens."""
        user = await db.users.find_one({"email": login_req.email})
        if not user:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Incorrect email or password",
            )
        
        if user.get("disabled"):
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Account suspended. Please contact administrator.",
            )

        if not verify_password(login_req.password, user["hashed_password"]):
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Incorrect email or password",
            )

        # Update last login
        now = datetime.now(timezone.utc)
        await db.users.update_one(
            {"_id": user["_id"]},
            {"$set": {"last_login": now}}
        )

        user["last_login"] = now
        user_out = UserOut(
            id=str(user["_id"]),
            email=user["email"],
            username=user["username"],
            display_name=user["display_name"],
            role=user["role"],
            disabled=user.get("disabled", False),
            storage_quota_mb=user.get("storage_quota_mb", 1024),
            storage_used_mb=user.get("storage_used_mb", 0.0),
            created_at=user["created_at"],
            last_login=user.get("last_login"),
            avatar_color=user.get("avatar_color", "#3b82f6")
        )

        access_token = create_access_token(data={"sub": user["email"]})
        refresh_token = create_refresh_token(data={"sub": user["email"]})

        # Save session to MongoDB (for revoking purposes)
        await db.sessions.insert_one({
            "email": user["email"],
            "token": refresh_token,
            "created_at": now,
            "expires_at": now + timedelta(days=30)
        })

        return TokenResponse(
            access_token=access_token,
            refresh_token=refresh_token,
            user=user_out
        )

    @staticmethod
    async def refresh_session(db: AsyncIOMotorDatabase, refresh_token: str) -> TokenResponse:
        """Validate refresh token and return new tokens."""
        email = verify_refresh_token(refresh_token)
        if not email:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid or expired refresh token",
            )

        # Check if session exists in DB
        session = await db.sessions.find_one({"token": refresh_token})
        if not session:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Session revoked or invalid",
            )

        user = await db.users.find_one({"email": email})
        if not user or user.get("disabled"):
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="User not found or suspended",
            )

        user_out = UserOut(
            id=str(user["_id"]),
            email=user["email"],
            username=user["username"],
            display_name=user["display_name"],
            role=user["role"],
            disabled=user.get("disabled", False),
            storage_quota_mb=user.get("storage_quota_mb", 1024),
            storage_used_mb=user.get("storage_used_mb", 0.0),
            created_at=user["created_at"],
            last_login=user.get("last_login"),
            avatar_color=user.get("avatar_color", "#3b82f6")
        )

        new_access_token = create_access_token(data={"sub": email})
        new_refresh_token = create_refresh_token(data={"sub": email})

        # Delete old session and insert new one
        await db.sessions.delete_one({"_id": session["_id"]})
        await db.sessions.insert_one({
            "email": email,
            "token": new_refresh_token,
            "created_at": datetime.now(timezone.utc)
        })

        return TokenResponse(
            access_token=new_access_token,
            refresh_token=new_refresh_token,
            user=user_out
        )

    @staticmethod
    async def revoke_session(db: AsyncIOMotorDatabase, refresh_token: str):
        """Revoke a session (logout)."""
        await db.sessions.delete_one({"token": refresh_token})
