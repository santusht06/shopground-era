from fastapi import APIRouter
from typing import List
import random
from datetime import datetime
from app.models.order import OrderCreate, OrderResponse
from app.core.database import get_database

router = APIRouter(prefix="/orders", tags=["Orders"])

# Fallback orders list in memory
orders_store = [
    {
        "id": "ORD-89241",
        "date": "2026-07-24",
        "total": 249.99,
        "status": "Processing",
        "itemsCount": 1,
        "items": [{"name": "Lorem Apex Headphones", "qty": 1, "price": 249.99}],
        "shippingAddress": "124 Lorem Avenue, Suite 400, San Francisco, CA"
    }
]

@router.get("", response_model=List[OrderResponse])
async def list_orders():
    db = get_database()
    if db is not None:
        try:
            orders = []
            cursor = db["orders"].find()
            async for doc in cursor:
                doc["_id"] = str(doc.get("_id", ""))
                orders.append(doc)
            if orders:
                return orders
        except Exception:
            pass
    return orders_store

@router.post("", response_model=OrderResponse)
async def create_order(order_data: OrderCreate):
    order_id = f"ORD-{random.randint(10000, 99999)}"
    new_order = {
        "id": order_id,
        "date": datetime.now().strftime("%Y-%m-%d"),
        "total": order_data.total,
        "status": "Processing",
        "itemsCount": len(order_data.items),
        "items": [item.model_dump() for item in order_data.items],
        "shippingAddress": order_data.shippingAddress,
    }

    db = get_database()
    if db is not None:
        try:
            await db["orders"].insert_one(dict(new_order))
        except Exception:
            pass

    orders_store.insert(0, new_order)
    return new_order
