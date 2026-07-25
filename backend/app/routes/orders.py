from fastapi import APIRouter, HTTPException, status
from typing import List
from datetime import datetime
from app.models.order import OrderCreate, OrderInDB, OrderStatusUpdate, OrderStatus
from app.core.database import get_database
from app.services.queue import enqueue_email_task

router = APIRouter(prefix="/orders", tags=["Order Fulfillment"])

DEMO_ORDERS = [
    {
        "_id": "ORD-89241",
        "date": "2026-07-25",
        "total": 249.99,
        "status": "Processing",
        "courier": "FedEx Express",
        "awb_number": "AWB-99824102",
        "warehouse": "Warehouse Alpha (US-West)",
        "customer": "Lorem Customer",
        "email": "customer@shopground.era",
        "shipping_address": "124 Lorem Avenue, San Francisco, CA 94107",
        "items": [{"name": "Lorem Apex Headphones", "qty": 1, "price": 249.99}]
    }
]

@router.get("", response_model=List[OrderInDB])
async def list_orders():
    """
    Retrieve list of orders for customer profile and admin fulfillment center.
    """
    db = get_database()
    if db:
        cursor = db.orders.find({})
        orders = await cursor.to_list(length=100)
        if orders:
            for o in orders:
                o["_id"] = str(o["_id"])
            return orders

    return DEMO_ORDERS

@router.post("", response_model=OrderInDB, status_code=status.HTTP_201_CREATED)
async def create_order(order_data: OrderCreate):
    """
    Submit a new customer purchase order and enqueue an order confirmation receipt via Redis Email Queue.
    """
    db = get_database()
    order_id = f"ORD-{datetime.utcnow().strftime('%H%M%S')}"

    order_dict = order_data.dict()
    order_dict["_id"] = order_id
    order_dict["date"] = datetime.utcnow().strftime("%Y-%m-%d")
    order_dict["status"] = OrderStatus.PROCESSING.value
    order_dict["courier"] = "FedEx Express"
    order_dict["awb_number"] = f"AWB-{datetime.utcnow().strftime('%S%M%H')}"
    order_dict["warehouse"] = "Warehouse Alpha (US-West)"

    if db:
        await db.orders.insert_one(order_dict)

    # Enqueue Redis task for Order Receipt Email Dispatch
    await enqueue_email_task(
        to_email=order_data.email,
        subject=f"Order Receipt #{order_id} — ShopGround Era",
        template="order_confirmation",
        context={"order_id": order_id, "total": order_data.total}
    )

    return order_dict

@router.patch("/{order_id}/status", response_model=OrderInDB)
async def update_order_status(order_id: str, status_data: OrderStatusUpdate):
    """
    Update order fulfillment status, courier partner, or AWB tracking number.
    """
    db = get_database()
    if db:
        update_fields = {"status": status_data.status.value}
        if status_data.courier:
            update_fields["courier"] = status_data.courier
        if status_data.awb_number:
            update_fields["awb_number"] = status_data.awb_number

        await db.orders.update_one({"_id": order_id}, {"$set": update_fields})
        order = await db.orders.find_one({"_id": order_id})
        if order:
            order["_id"] = str(order["_id"])
            return order

    for o in DEMO_ORDERS:
        if o["_id"] == order_id:
            o["status"] = status_data.status.value
            if status_data.courier:
                o["courier"] = status_data.courier
            if status_data.awb_number:
                o["awb_number"] = status_data.awb_number
            return o

    raise HTTPException(status_code=404, detail=f"Order {order_id} not found.")
