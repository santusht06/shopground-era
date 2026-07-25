import os
from typing import List
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    PROJECT_NAME: str = "ShopGround Era API"
    VERSION: str = "1.0.0"
    API_V1_STR: str = "/api/v1"

    # Security & JWT Tokens (Sharexpress Authentication)
    SECRET_KEY: str = os.getenv("SECRET_KEY", "shopground_era_super_secret_jwt_key_998877")
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60
    REFRESH_TOKEN_EXPIRE_DAYS: int = 7

    # MongoDB Motor Database Connection
    MONGODB_URL: str = os.getenv("MONGODB_URL", "mongodb://localhost:27017")
    DATABASE_NAME: str = os.getenv("DATABASE_NAME", "shopground_db")

    # Redis Database & Queue Connection
    REDIS_URL: str = os.getenv("REDIS_URL", "redis://localhost:6379/0")

    # Production CORS Allowed Origins
    CORS_ORIGINS: List[str] = [
        "http://localhost:5173",
        "http://localhost:5174",
        "http://myapp.com",
        "https://myapp.com",
        "http://admin.myapp.com",
        "https://admin.myapp.com",
        "*"
    ]

    class Config:
        case_sensitive = True

settings = Settings()
