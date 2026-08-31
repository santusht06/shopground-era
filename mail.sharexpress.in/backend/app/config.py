from pydantic_settings import BaseSettings
from typing import List


class Settings(BaseSettings):
    # Project
    PROJECT_ENV: str = "development"
    MAIL_DOMAIN: str = "sharexpress.in"
    MAIL_HOSTNAME: str = "mail.sharexpress.in"

    # Database
    MONGO_URI: str = "mongodb://localhost:27017"
    MONGO_DB: str = "maildb"

    # Redis
    REDIS_URL: str = "redis://localhost:6379/0"

    # RabbitMQ / Celery
    RABBITMQ_URL: str = "amqp://guest:guest@localhost:5672/"

    # JWT
    JWT_SECRET: str = "changeme"
    JWT_ALGORITHM: str = "HS256"
    JWT_EXPIRE_MINUTES: int = 60
    JWT_REFRESH_EXPIRE_DAYS: int = 30

    # CORS
    CORS_ORIGINS: str = "https://mail.sharexpress.in,http://localhost:5173"

    # Admin
    ADMIN_EMAIL: str = "santusht@sharexpress.in"
    ADMIN_PASSWORD: str = "changeme"

    # Mail server
    POSTFIX_HOST: str = "localhost"
    POSTFIX_PORT: int = 25
    DOVECOT_HOST: str = "localhost"
    DOVECOT_IMAP_PORT: int = 143

    # Storage
    MAIL_VHOST_PATH: str = "/var/mail/vhosts"
    ATTACHMENT_DIR: str = "/app/attachments"
    MAX_ATTACHMENT_SIZE_MB: int = 25

    # MinIO S3 Settings
    MINIO_ACCESS_KEY: str = "sharexpress_service"
    MINIO_SECRET_KEY: str = "superStrongPassword123"
    MINIO_REGION: str = "us-east-1"
    MINIO_BUCKET: str = "mail-attachments"
    MINIO_ENDPOINT_INTERNAL: str = "http://192.168.29.104:9000"
    MINIO_ENDPOINT_PUBLIC: str = "https://drive.sharexpress.in"

    # Rate limiting
    RATE_LIMIT_PER_MINUTE: int = 60
    SMTP_RATE_LIMIT_PER_HOUR: int = 500

    class Config:
        env_file = ".env"
        case_sensitive = True
        extra = "ignore"


settings = Settings()
