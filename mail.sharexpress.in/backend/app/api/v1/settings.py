"""FastAPI routes for user profile settings."""
from fastapi import APIRouter, Depends, HTTPException, status
from motor.motor_asyncio import AsyncIOMotorDatabase
from pydantic import BaseModel, Field

from app.core.deps import get_database, get_current_user
from app.core.security import hash_password, verify_password
from app.models.user import UserOut

router = APIRouter()

class ProfileUpdateRequest(BaseModel):
    display_name: str = Field(..., min_length=2, max_length=50)

class PasswordChangeRequest(BaseModel):
    current_password: str
    new_password: str = Field(..., min_length=8)

@router.put("/profile", response_model=UserOut)
async def update_profile(
    req: ProfileUpdateRequest,
    db: AsyncIOMotorDatabase = Depends(get_database),
    current_user: dict = Depends(get_current_user)
):
    """Update profile metadata (display name)."""
    await db.users.update_one(
        {"_id": current_user["_id"]},
        {"$set": {"display_name": req.display_name}}
    )
    # Fetch updated user
    updated = await db.users.find_one({"_id": current_user["_id"]})
    return UserOut(
        id=str(updated["_id"]),
        email=updated["email"],
        username=updated["username"],
        display_name=updated["display_name"],
        role=updated["role"],
        disabled=updated.get("disabled", False),
        storage_quota_mb=updated.get("storage_quota_mb", 1024),
        storage_used_mb=updated.get("storage_used_mb", 0.0),
        created_at=updated["created_at"],
        last_login=updated.get("last_login"),
        avatar_color=updated.get("avatar_color", "#3b82f6")
    )

@router.put("/password", status_code=status.HTTP_200_OK)
async def change_password(
    req: PasswordChangeRequest,
    db: AsyncIOMotorDatabase = Depends(get_database),
    current_user: dict = Depends(get_current_user)
):
    """Change mailbox access password."""
    if not verify_password(req.current_password, current_user["hashed_password"]):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Incorrect current password"
        )
    
    await db.users.update_one(
        {"_id": current_user["_id"]},
        {"$set": {"hashed_password": hash_password(req.new_password)}}
    )
    return {"status": "success", "message": "Password changed successfully"}
