"""FastAPI routes for Authentication."""
from fastapi import APIRouter, Depends, status
from motor.motor_asyncio import AsyncIOMotorDatabase

from app.core.deps import get_database, get_current_user
from app.models.user import LoginRequest, TokenResponse, RefreshRequest, UserOut
from app.services.auth_service import AuthService

router = APIRouter()

@router.post("/login", response_model=TokenResponse, status_code=status.HTTP_200_OK)
async def login(
    login_req: LoginRequest,
    db: AsyncIOMotorDatabase = Depends(get_database)
):
    """Authenticate user and return access & refresh tokens."""
    return await AuthService.authenticate_user(db, login_req)

@router.post("/refresh", response_model=TokenResponse, status_code=status.HTTP_200_OK)
async def refresh(
    refresh_req: RefreshRequest,
    db: AsyncIOMotorDatabase = Depends(get_database)
):
    """Obtain new access & refresh tokens using a valid refresh token."""
    return await AuthService.refresh_session(db, refresh_req.refresh_token)

@router.post("/logout", status_code=status.HTTP_204_NO_CONTENT)
async def logout(
    refresh_req: RefreshRequest,
    db: AsyncIOMotorDatabase = Depends(get_database),
    current_user: dict = Depends(get_current_user)
):
    """Revoke a session (logout)."""
    await AuthService.revoke_session(db, refresh_req.refresh_token)

@router.get("/me", response_model=UserOut)
async def get_me(current_user: dict = Depends(get_current_user)):
    """Get profile of current authenticated user."""
    return UserOut(
        id=str(current_user["_id"]),
        email=current_user["email"],
        username=current_user["username"],
        display_name=current_user["display_name"],
        role=current_user["role"],
        disabled=current_user.get("disabled", False),
        storage_quota_mb=current_user.get("storage_quota_mb", 1024),
        storage_used_mb=current_user.get("storage_used_mb", 0.0),
        created_at=current_user["created_at"],
        last_login=current_user.get("last_login"),
        avatar_color=current_user.get("avatar_color", "#3b82f6")
    )
