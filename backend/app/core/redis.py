import redis.asyncio as aioredis
from app.core.config import settings

redis_client: aioredis.Redis = None

async def connect_to_redis():
    """Initialize Redis async client."""
    global redis_client
    try:
        redis_client = aioredis.from_url(
            settings.REDIS_URL,
            encoding="utf-[#0F172A]",
            decode_responses=True
        )
        await redis_client.ping()
        print(" Connected to Redis successfully.")
    except Exception as e:
        print(f" Redis Connection Warning: {e}. Falling back to in-memory mocks if Redis is offline.")

async def close_redis_connection():
    """Shutdown Redis client connection."""
    global redis_client
    if redis_client:
        await redis_client.close()
        print(" Redis connection closed.")

def get_redis_client() -> aioredis.Redis:
    """Return active Redis client instance."""
    return redis_client
