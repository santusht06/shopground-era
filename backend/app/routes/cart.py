from fastapi import APIRouter
import json
from app.models.cart import CartUpdate
from app.core.redis import get_redis_client as get_redis

router = APIRouter(prefix="/cart", tags=["Cart"])

@router.post("/sync")
async def sync_cart(cart: CartUpdate):
    redis = get_redis()
    if redis:
        try:
            cart_key = f"cart:{cart.user_id}"
            await redis.set(cart_key, cart.model_dump_json())
            return {"status": "synced", "user_id": cart.user_id, "item_count": len(cart.items)}
        except Exception as e:
            return {"status": "redis_unavailable", "error": str(e)}
    return {"status": "local_mode", "item_count": len(cart.items)}

@router.get("/{user_id}")
async def get_cart(user_id: str):
    redis = get_redis()
    if redis:
        try:
            data = await redis.get(f"cart:{user_id}")
            if data:
                return json.loads(data)
        except Exception:
            pass
    return {"user_id": user_id, "items": [], "couponCode": None}
