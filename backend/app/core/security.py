import os
import random
import string
from datetime import datetime, timedelta
from typing import Optional, Dict, Any
from jose import jwt, JWTError
from passlib.context import CryptContext
from cryptography.hazmat.primitives.asymmetric import rsa
from cryptography.hazmat.primitives import serialization
from app.core.config import settings

# Password hashing context (bcrypt)
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def _generate_rsa_keypair():
    """Dynamically generate a 2048-bit RSA Private/Public Keypair in PEM format for RS256 signing."""
    private_key = rsa.generate_private_key(
        public_exponent=65537,
        key_size=2048,
    )
    pem_private = private_key.private_bytes(
        encoding=serialization.Encoding.PEM,
        format=serialization.PrivateFormat.PKCS8,
        encryption_algorithm=serialization.NoEncryption()
    ).decode('utf-8')

    pem_public = private_key.public_key().public_bytes(
        encoding=serialization.Encoding.PEM,
        format=serialization.PublicFormat.SubjectPublicKeyInfo
    ).decode('utf-8')

    return pem_private, pem_public

# Load or generate RSA Keys for RS256
_RSA_PRIVATE_KEY_DEFAULT, _RSA_PUBLIC_KEY_DEFAULT = _generate_rsa_keypair()

RSA_PRIVATE_KEY = os.getenv("JWT_PRIVATE_KEY", _RSA_PRIVATE_KEY_DEFAULT)
RSA_PUBLIC_KEY = os.getenv("JWT_PUBLIC_KEY", _RSA_PUBLIC_KEY_DEFAULT)

def hash_password(password: str) -> str:
    """Hash plain text password with bcrypt."""
    return pwd_context.hash(password)

def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Verify plain text password against stored hash."""
    return pwd_context.verify(plain_password, hashed_password)

def generate_otp_code(length: int = 6) -> str:
    """Generate a random numeric 6-digit OTP code for Sharexpress email auth."""
    return "".join(random.choices(string.digits, k=length))

def create_access_token(data: Dict[str, Any], expires_delta: Optional[timedelta] = None) -> str:
    """Generate JWT access token using RS256 Asymmetric RSA Private Key Signature."""
    to_encode = data.copy()
    expire = datetime.utcnow() + (expires_delta or timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES))
    to_encode.update({"exp": expire, "type": "access"})
    return jwt.encode(to_encode, RSA_PRIVATE_KEY, algorithm=settings.ALGORITHM)

def create_refresh_token(data: Dict[str, Any]) -> str:
    """Generate JWT refresh token using RS256 Asymmetric RSA Private Key Signature."""
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(days=settings.REFRESH_TOKEN_EXPIRE_DAYS)
    to_encode.update({"exp": expire, "type": "refresh"})
    return jwt.encode(to_encode, RSA_PRIVATE_KEY, algorithm=settings.ALGORITHM)

def decode_token(token: str) -> Optional[Dict[str, Any]]:
    """Decode and validate RS256 JWT token using RSA Public Key."""
    try:
        payload = jwt.decode(token, RSA_PUBLIC_KEY, algorithms=[settings.ALGORITHM])
        return payload
    except JWTError:
        return None
