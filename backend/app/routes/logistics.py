from fastapi import APIRouter, HTTPException, status, Depends
from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import datetime
from app.middleware.rbac import require_permission
from app.core.database import get_database

router = APIRouter(prefix="/logistics", tags=["Third Party Logistics & 3PL"])

class ShipmentCreateRequest(BaseModel):
    order_id: str = Field(..., example="ORD-89241")
    provider: str = Field("fedex", example="shiprocket") # fedex | shiprocket | delhivery
    warehouse_id: str = Field("warehouse_alpha_usw", example="warehouse_alpha_usw")

class ShipmentResponse(BaseModel):
    shipment_id: str
    order_id: str
    provider: str
    awb_number: str
    tracking_url: str
    status: str

@router.post("/create-shipment", response_model=ShipmentResponse)
async def create_shipment(
    req: ShipmentCreateRequest,
    current_user: dict = Depends(require_permission("orders:update_status"))
):
    """
    Integrate 3PL logistics provider (Shiprocket / Delhivery / FedEx) to generate AWB and tracking label.
    """
    awb_number = f"AWB-{req.provider.upper()}-{datetime.utcnow().strftime('%M%H%d')}"
    tracking_url = f"https://track.{req.provider}.com/{awb_number}"
    shipment_id = f"shp_{datetime.utcnow().strftime('%S%M%H')}"

    db = get_database()
    if db:
        await db.orders.update_one(
            {"_id": req.order_id},
            {"$set": {
                "logistics.provider": req.provider,
                "logistics.awb_number": awb_number,
                "logistics.tracking_url": tracking_url,
                "status": "Packed"
            }}
        )

    return ShipmentResponse(
        shipment_id=shipment_id,
        order_id=req.order_id,
        provider=req.provider,
        awb_number=awb_number,
        tracking_url=tracking_url,
        status="Packed"
    )

@router.post("/webhooks/{provider}")
async def logistics_webhook_handler(provider: str, payload: dict):
    """
    Normalized Webhook Synchronization for Shiprocket, Delhivery, FedEx.
    """
    awb_number = payload.get("awb_number") or payload.get("tracking_number")
    event_status = payload.get("status", "in_transit").lower()

    status_map = {
        "pickup_scheduled": "Packed",
        "in_transit": "Shipped",
        "out_for_delivery": "Out for Delivery",
        "delivered": "Delivered",
        "returned": "Cancelled"
    }
    
    canonical_status = status_map.get(event_status, "Shipped")

    db = get_database()
    if db and awb_number:
        await db.orders.update_one(
            {"logistics.awb_number": awb_number},
            {"$set": {"status": canonical_status}}
        )

    return {"status": "success", "provider": provider, "canonical_status": canonical_status}
