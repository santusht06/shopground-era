from fastapi import APIRouter
from app.core.database import get_database
from app.core.redis import get_redis

router = APIRouter(prefix="/health", tags=["Health"])

@router.get("")
async def check_health():
    db = get_database()
    redis = get_redis()

    mongo_status = "connected" if db is not None else "disconnected"
    redis_status = "connected" if redis is not None else "disconnected"

    return {
        "status": "online",
        "service": "ShopGround Era API",
        "mongodb": mongo_status,
        "redis": redis_status,
    }
