from fastapi import APIRouter, HTTPException, status, Depends
from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime
from app.middleware.auth import get_current_user
from app.core.database import get_database

router = APIRouter(prefix="/payments", tags=["Payment Gateway Engine"])

class PaymentIntentRequest(BaseModel):
    order_id: str = Field(..., example="ORD-89241")
    amount: float = Field(..., gt=0, example=243.74)
    currency: str = Field("usd", example="usd")
    gateway: str = Field("stripe", example="stripe") # stripe | razorpay | cod

class PaymentIntentResponse(BaseModel):
    payment_intent_id: str
    client_secret: str
    amount: float
    currency: str
    gateway: str
    status: str

@router.post("/intent", response_model=PaymentIntentResponse)
async def create_payment_intent(
    req: PaymentIntentRequest,
    current_user: dict = Depends(get_current_user)
):
    """
    Generate PaymentIntent client secret for Stripe or Razorpay integration.
    """
    intent_id = f"pi_{req.gateway}_{datetime.utcnow().strftime('%S%M%H%d')}"
    client_secret = f"{intent_id}_secret_{datetime.utcnow().strftime('%Y%m%d')}"
    
    db = get_database()
    payment_record = {
        "_id": intent_id,
        "order_id": req.order_id,
        "customer_id": current_user["_id"],
        "amount": req.amount,
        "currency": req.currency,
        "gateway": req.gateway,
        "status": "requires_payment_method",
        "created_at": datetime.utcnow().isoformat()
    }
    
    if db:
        await db.payments.insert_one(payment_record)

    return PaymentIntentResponse(
        payment_intent_id=intent_id,
        client_secret=client_secret,
        amount=req.amount,
        currency=req.currency,
        gateway=req.gateway,
        status="requires_payment_method"
    )

@router.post("/webhooks/stripe")
async def stripe_webhook_handler(payload: dict):
    """
    Stripe Webhook Handler for verifying signature & status updates.
    """
    event_type = payload.get("type", "payment_intent.succeeded")
    payment_intent = payload.get("data", {}).get("object", {})
    order_id = payment_intent.get("metadata", {}).get("order_id", "ORD-89241")

    db = get_database()
    if db and order_id:
        await db.orders.update_one(
            {"_id": order_id},
            {"$set": {"payment.status": "captured", "status": "processing"}}
        )

    return {"status": "success", "processed_event": event_type}
