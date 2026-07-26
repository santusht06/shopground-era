import json
import asyncio
import redis.asyncio as aioredis
from app.core.config import settings

EMAIL_QUEUE_KEY = "shopground:email_queue"

async def process_email_queue():
    """
    Background worker task engine for Redis Email Queue.
    Pulls enqueued email jobs and simulates high-throughput dispatch.
    """
    print(" Starting ShopGround Era Redis Background Email Worker...")
    try:
        redis_client = aioredis.from_url(settings.REDIS_URL, decode_responses=True)
        await redis_client.ping()
        print(f" Listening to Redis task queue: {EMAIL_QUEUE_KEY}")
    except Exception as e:
        print(f" [Worker Alert] Redis Connection Warning: {e}. Worker running in standby polling mode.")
        return

    while True:
        try:
            # Pop task from Redis queue (blocking right pop)
            task_data = await redis_client.blpop(EMAIL_QUEUE_KEY, timeout=5)
            if task_data:
                queue_name, raw_payload = task_data
                payload = json.loads(raw_payload)
                to_email = payload.get("to_email")
                subject = payload.get("subject")
                template = payload.get("template")
                
                print(f" [DISPATCH SUCCESS] Sent email ({template}) to '{to_email}' | Subject: '{subject}'")
        except Exception as e:
            print(f" [Worker Error] Task processing error: {e}")
        
        await asyncio.sleep(1)

if __name__ == "__main__":
    asyncio.run(process_email_queue())
