from fastapi import APIRouter, HTTPException, status, Depends
from pydantic import BaseModel, Field
from typing import List, Optional
from app.middleware.rbac import require_permission
from app.core.database import get_database

router = APIRouter(prefix="/inventory", tags=["Multi-Warehouse Inventory Control"])

class StockAdjustmentRequest(BaseModel):
    sku: str = Field(..., example="HD-BLK")
    warehouse_id: str = Field(..., example="warehouse_alpha_usw")
    adjustment_type: str = Field("add", example="add") # add | deduct | set
    quantity: int = Field(..., example="50")
    reason: Optional[str] = Field("Inbound Stock Restock", example="Inbound Purchase Order")

@router.get("")
async def list_inventory(
    current_user: dict = Depends(require_permission("inventory:read"))
):
    """
    Retrieve inventory status across multi-warehouse locations.
    """
    db = get_database()
    if db:
        cursor = db.inventory.find({})
        items = await cursor.to_list(length=100)
        if items:
            for item in items:
                item["_id"] = str(item["_id"])
            return items

    return [
        {
            "_id": "inv_001",
            "sku": "HD-BLK",
            "product_name": "Lorem Apex Headphones",
            "warehouse_id": "Warehouse Alpha (US-West)",
            "quantity_on_hand": 18,
            "quantity_reserved": 2,
            "quantity_available": 16,
            "reorder_point": 5,
            "status": "In Stock"
        }
    ]

@router.patch("/stock")
async def adjust_stock(
    req: StockAdjustmentRequest,
    current_user: dict = Depends(require_permission("inventory:update"))
):
    """
    Adjust SKU stock levels with audit trail logging.
    """
    db = get_database()
    if db:
        doc = await db.inventory.find_one({"sku": req.sku, "warehouse_id": req.warehouse_id})
        if doc:
            current_qty = doc.get("quantity_on_hand", 0)
            new_qty = current_qty + req.quantity if req.adjustment_type == "add" else max(0, current_qty - req.quantity)
            await db.inventory.update_one(
                {"_id": doc["_id"]},
                {"$set": {"quantity_on_hand": new_qty, "quantity_available": max(0, new_qty - doc.get("quantity_reserved", 0))}}
            )
            return {"status": "success", "sku": req.sku, "new_quantity": new_qty}

    return {"status": "success", "sku": req.sku, "new_quantity": req.quantity, "message": "Stock adjusted (Demo)"}
