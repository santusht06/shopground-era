from fastapi import APIRouter, Request
from fastapi.responses import StreamingResponse
import asyncio
import json
import random
import time

router = APIRouter(prefix="/sse", tags=["Server-Sent Events Realtime Stream"])

async def event_generator(request: Request):
    """
    Server-Sent Events (SSE) generator streaming real-time inventory levels, 
    active buyer count, and sample order dispatches.
    """
    stock_level = 1500
    active_viewers = 24

    while True:
        # Check if client connection was closed
        if await request.is_disconnected():
            break

        # Simulate slight real-time fluctuations
        active_viewers = max(18, min(65, active_viewers + random.randint(-2, 3)))
        if random.random() < 0.3:
            stock_level = max(100, stock_level - random.randint(1, 3))

        data = {
            "timestamp": int(time.time()),
            "product_id": "66a87f12bc09a123456789ab",
            "stock_remaining": stock_level,
            "active_viewers": active_viewers,
            "live_status": "Normal Production Run",
            "last_order_location": random.choice([
                "Chicago, IL", "San Francisco, CA", "Toronto, ON",
                "Austin, TX", "London, UK", "Berlin, DE", "New York, NY"
            ]),
        }

        # Format as SSE event
        yield f"event: inventory_update\ndata: {json.dumps(data)}\n\n"
        await asyncio.sleep(4)

@router.get("/inventory")
async def sse_inventory(request: Request):
    """
    Server-Sent Events (SSE) endpoint providing real-time stock and viewer activity updates.
    """
    return StreamingResponse(
        event_generator(request),
        media_type="text/event-stream",
        headers={
            "Cache-Control": "no-cache",
            "Connection": "keep-alive",
            "X-Accel-Buffering": "no", # Disable Nginx buffering for instant SSE delivery
        }
    )
