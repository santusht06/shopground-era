from enum import Enum
from typing import Optional
from pydantic import BaseModel, EmailStr, Field

class UserRole(str, Enum):
    SUPER_ADMIN = "super_admin"
    STORE_MANAGER = "store_manager"
    CATALOG_SPECIALIST = "catalog_specialist"
    FULFILLMENT_AGENT = "fulfillment_agent"
    CUSTOMER = "customer"

class UserBase(BaseModel):
    name: str = Field(..., example="Lorem Customer")
    email: EmailStr = Field(..., example="customer@shopground.era")
    phone: Optional[str] = Field(None, example="+1 (555) 234-5678")
    avatar: Optional[str] = Field(None, example="https://images.unsplash.com/photo-1534528741775-53994a69daeb")
    role: UserRole = UserRole.CUSTOMER

class UserCreate(UserBase):
    password: str = Field(..., min_length=6, example="Secret123!")

class UserLogin(BaseModel):
    email: EmailStr = Field(..., example="customer@shopground.era")
    password: str = Field(..., example="Secret123!")

class OTPRequest(BaseModel):
    email: EmailStr = Field(..., example="customer@shopground.era")

class OTPVerify(BaseModel):
    email: EmailStr = Field(..., example="customer@shopground.era")
    otp_code: str = Field(..., min_length=6, max_length=6, example="892410")

class TokenResponse(BaseModel):
    access_token: str
    refresh_token: str
    token_type: str = "bearer"
    user: UserBase

class UserInDB(UserBase):
    id: str = Field(alias="_id")
    hashed_password: str
    is_active: bool = True
    member_since: str
