"""FastAPI routes for administration dashboard."""
from fastapi import APIRouter, Depends, status, Query
from motor.motor_asyncio import AsyncIOMotorDatabase
from typing import List
from bson import ObjectId

from app.core.deps import get_database, get_current_admin
from app.models.user import UserOut, UserCreate, UserUpdate
from app.services.user_service import UserService

router = APIRouter()

@router.get("/users", response_model=List[UserOut])
async def list_users(
    limit: int = Query(100, ge=1, le=500),
    skip: int = Query(0, ge=0),
    db: AsyncIOMotorDatabase = Depends(get_database),
    current_admin: dict = Depends(get_current_admin)
):
    """List all active and suspended mailboxes in the domain (Admin-only)."""
    cursor = db.users.find().skip(skip).limit(limit)
    users = []
    async for u in cursor:
        users.append(UserOut(
            id=str(u["_id"]),
            email=u["email"],
            username=u["username"],
            display_name=u["display_name"],
            role=u["role"],
            disabled=u.get("disabled", False),
            storage_quota_mb=u.get("storage_quota_mb", 1024),
            storage_used_mb=u.get("storage_used_mb", 0.0),
            created_at=u["created_at"],
            last_login=u.get("last_login"),
            avatar_color=u.get("avatar_color", "#3b82f6")
        ))
    return users

@router.post("/users", response_model=UserOut, status_code=status.HTTP_201_CREATED)
async def create_mailbox(
    req: UserCreate,
    db: AsyncIOMotorDatabase = Depends(get_database),
    current_admin: dict = Depends(get_current_admin)
):
    """Provision a new email mailbox for an employee (Admin-only)."""
    user_doc = await UserService.create_user(db, req)
    return UserOut(
        id=str(user_doc["_id"]),
        email=user_doc["email"],
        username=user_doc["username"],
        display_name=user_doc["display_name"],
        role=user_doc["role"],
        disabled=user_doc.get("disabled", False),
        storage_quota_mb=user_doc.get("storage_quota_mb", 1024),
        storage_used_mb=user_doc.get("storage_used_mb", 0.0),
        created_at=user_doc["created_at"],
        last_login=user_doc.get("last_login"),
        avatar_color=user_doc.get("avatar_color", "#3b82f6")
    )

@router.put("/users/{user_id}", response_model=UserOut)
async def update_mailbox(
    user_id: str,
    req: UserUpdate,
    db: AsyncIOMotorDatabase = Depends(get_database),
    current_admin: dict = Depends(get_current_admin)
):
    """Modify mailbox configuration, storage limits, or suspend accounts (Admin-only)."""
    user_doc = await UserService.update_user(db, user_id, req)
    return UserOut(
        id=str(user_doc["_id"]),
        email=user_doc["email"],
        username=user_doc["username"],
        display_name=user_doc["display_name"],
        role=user_doc["role"],
        disabled=user_doc.get("disabled", False),
        storage_quota_mb=user_doc.get("storage_quota_mb", 1024),
        storage_used_mb=user_doc.get("storage_used_mb", 0.0),
        created_at=user_doc["created_at"],
        last_login=user_doc.get("last_login"),
        avatar_color=user_doc.get("avatar_color", "#3b82f6")
    )

@router.delete("/users/{user_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_mailbox(
    user_id: str,
    db: AsyncIOMotorDatabase = Depends(get_database),
    current_admin: dict = Depends(get_current_admin)
):
    """Decommission and permanently delete an employee mailbox (Admin-only)."""
    await UserService.delete_user(db, user_id)
