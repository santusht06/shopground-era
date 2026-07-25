from fastapi import APIRouter, HTTPException, status, Depends
from datetime import datetime
from typing import Dict, Any
from app.models.user import UserCreate, UserLogin, OTPRequest, OTPVerify, TokenResponse, UserBase, UserRole
from app.core.security import hash_password, verify_password, create_access_token, create_refresh_token, generate_otp_code, decode_token
from app.core.database import get_database
from app.services.queue import enqueue_email_task

router = APIRouter(prefix="/auth", tags=["Sharexpress Authentication"])

# Mock OTP storage (in production backed by Redis TTL key)
otp_store: Dict[str, str] = {}

@router.post("/register", response_model=TokenResponse, status_code=status.HTTP_201_CREATED)
async def register_user(user_data: UserCreate):
    """
    Register a new user account with bcrypt password hashing
    and enqueue a welcome email task in the Redis queue.
    """
    db = get_database()
    
    # Check if user already exists
    existing = await db.users.find_one({"email": user_data.email}) if db else None
    if existing:
        raise HTTPException(status_code=400, detail="User with this email already exists.")

    hashed_pw = hash_password(user_data.password)
    new_user_dict = {
        "name": user_data.name,
        "email": user_data.email,
        "phone": user_data.phone,
        "avatar": user_data.avatar or "https://images.unsplash.com/photo-1534528741775-53994a69daeb",
        "role": user_data.role.value,
        "hashed_password": hashed_pw,
        "is_active": True,
        "member_since": datetime.utcnow().strftime("%B %Y")
    }

    if db:
        res = await db.users.insert_one(new_user_dict)
        new_user_dict["_id"] = str(res.inserted_id)

    # Enqueue welcome email in Redis Queue
    await enqueue_email_task(
        to_email=user_data.email,
        subject="Welcome to ShopGround Era!",
        template="welcome_email",
        context={"name": user_data.name}
    )

    token_data = {"sub": user_data.email, "role": user_data.role.value}
    access_token = create_access_token(token_data)
    refresh_token = create_refresh_token(token_data)

    user_base = UserBase(
        name=user_data.name,
        email=user_data.email,
        phone=user_data.phone,
        avatar=user_data.avatar,
        role=user_data.role
    )

    return TokenResponse(
        access_token=access_token,
        refresh_token=refresh_token,
        user=user_base
    )

@router.post("/login", response_model=TokenResponse)
async def login_user(credentials: UserLogin):
    """
    Authenticate user via Email & Password (Bcrypt verification).
    """
    db = get_database()
    user_record = await db.users.find_one({"email": credentials.email}) if db else None

    # Demo fallback check
    if not user_record and credentials.email == "customer@shopground.era":
        user_record = {
            "name": "Lorem Customer",
            "email": "customer@shopground.era",
            "phone": "+1 (555) 234-5678",
            "avatar": "https://images.unsplash.com/photo-1534528741775-53994a69daeb",
            "role": "customer",
            "hashed_password": hash_password("Secret123!"),
        }

    if not user_record or not verify_password(credentials.password, user_record.get("hashed_password", "")):
        raise HTTPException(status_code=401, detail="Invalid email or password.")

    token_data = {"sub": user_record["email"], "role": user_record.get("role", "customer")}
    access_token = create_access_token(token_data)
    refresh_token = create_refresh_token(token_data)

    user_base = UserBase(
        name=user_record["name"],
        email=user_record["email"],
        phone=user_record.get("phone"),
        avatar=user_record.get("avatar"),
        role=UserRole(user_record.get("role", "customer"))
    )

    return TokenResponse(
        access_token=access_token,
        refresh_token=refresh_token,
        user=user_base
    )

@router.post("/request-otp")
async def request_email_otp(data: OTPRequest):
    """
    Sharexpress-Inspired Email Login OTP Request.
    Generates a 6-digit OTP code and enqueues it into the Redis Email Queue.
    """
    otp_code = generate_otp_code()
    otp_store[data.email] = otp_code

    # Dispatch OTP via Redis Task Queue
    await enqueue_email_task(
        to_email=data.email,
        subject="Your ShopGround Login OTP Code",
        template="otp_verification",
        context={"otp_code": otp_code}
    )

    return {
        "status": "success",
        "message": f"OTP verification code sent to {data.email} via Redis email queue.",
        "demo_otp_hint": otp_code  # Printed for instant API testing ease
    }

@router.post("/verify-otp", response_model=TokenResponse)
async def verify_email_otp(data: OTPVerify):
    """
    Verify Sharexpress 6-digit OTP code and return JWT authentication tokens.
    """
    stored_otp = otp_store.get(data.email)
    if not stored_otp or stored_otp != data.otp_code:
        raise HTTPException(status_code=400, detail="Invalid or expired OTP code.")

    # Clear used OTP
    otp_store.pop(data.email, None)

    token_data = {"sub": data.email, "role": "customer"}
    access_token = create_access_token(token_data)
    refresh_token = create_refresh_token(token_data)

    user_base = UserBase(
        name=data.email.split("@")[0].capitalize(),
        email=data.email,
        role=UserRole.CUSTOMER
    )

    return TokenResponse(
        access_token=access_token,
        refresh_token=refresh_token,
        user=user_base
    )
