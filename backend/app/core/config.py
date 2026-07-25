from pydantic_settings import BaseSettings, SettingsConfigDict
from typing import List

class Settings(BaseSettings):
    PROJECT_NAME: str = "ShopGround Era E-Commerce API"
    API_V1_STR: str = "/api/v1"
    MONGODB_URL: str = "mongodb://localhost:27017"
    DATABASE_NAME: str = "shopground_db"
    REDIS_URL: str = "redis://localhost:6379/0"
    SECRET_KEY: str = "shopground_era_secret_key_change_in_production"
    CORS_ORIGINS: List[str] = [
        "http://localhost:5173",
        "http://localhost:5174",
        "http://localhost:3000",
        "http://localhost:3001",
        "http://myapp.com",
        "https://myapp.com",
        "http://admin.myapp.com",
        "https://admin.myapp.com",
        "*"
    ]

    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8", extra="ignore")

settings = Settings()
