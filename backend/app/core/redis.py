import redis.asyncio as aioredis
import logging
from app.core.config import settings

logger = logging.getLogger(__name__)

class RedisManager:
    redis: aioredis.Redis = None

redis_manager = RedisManager()

async def connect_to_redis():
    try:
        redis_manager.redis = aioredis.from_url(settings.REDIS_URL, decode_responses=True)
        await redis_manager.redis.ping()
        logger.info("Connected to Redis successfully.")
    except Exception as e:
        logger.warning(f"Could not connect to Redis at {settings.REDIS_URL}: {e}")
        redis_manager.redis = None

async def close_redis_connection():
    if redis_manager.redis:
        await redis_manager.redis.close()
        logger.info("Redis connection closed.")

def get_redis():
    return redis_manager.redis
