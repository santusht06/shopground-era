"""Pydantic models for users and mailboxes."""
from pydantic import BaseModel, EmailStr, Field
from typing import Optional
from datetime import datetime


class UserBase(BaseModel):
    email: EmailStr
    display_name: str
    role: str = "user"  # "user" | "admin"


class UserCreate(UserBase):
    password: str = Field(..., min_length=8)


class UserUpdate(BaseModel):
    display_name: Optional[str] = None
    password: Optional[str] = Field(None, min_length=8)
    disabled: Optional[bool] = None
    storage_quota_mb: Optional[int] = None


class UserOut(UserBase):
    id: str
    username: str  # local part of email
    disabled: bool = False
    storage_quota_mb: int = 1024
    storage_used_mb: float = 0.0
    created_at: datetime
    last_login: Optional[datetime] = None
    avatar_color: str = "#3b82f6"

    class Config:
        from_attributes = True


class LoginRequest(BaseModel):
    email: EmailStr
    password: str


class TokenResponse(BaseModel):
    access_token: str
    refresh_token: str
    token_type: str = "bearer"
    user: UserOut


class RefreshRequest(BaseModel):
    refresh_token: str
