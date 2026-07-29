from fastapi import APIRouter
from app.core.database import get_database
from app.services.queue import get_queue_length
from app.core.config import settings

router = APIRouter(prefix="/health", tags=["System Diagnostics"])

@router.get("")
async def system_health_check():
    """
    Production Health Diagnostic Endpoint.
    Checks MongoDB, Redis Task Queue, and System Status.
    """
    db = get_database()
    mongo_status = "Connected" if db is not None else "Offline / Standby"

    pending_email_tasks = await get_queue_length()

    return {
        "status": "healthy",
        "service": settings.PROJECT_NAME,
        "version": settings.VERSION,
        "mongodb": mongo_status,
        "redis_email_queue": {
            "status": "Active",
            "pending_email_tasks": pending_email_tasks,
            "queue_key": "shopground:email_queue"
        },
        "cors_origins": settings.CORS_ORIGINS
    }
