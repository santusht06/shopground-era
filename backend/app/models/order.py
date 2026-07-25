from enum import Enum
from typing import List, Optional
from pydantic import BaseModel, Field, EmailStr

class OrderStatus(str, Enum):
    PROCESSING = "Processing"
    DISPATCHED = "Dispatched"
    SHIPPED = "Shipped"
    DELIVERED = "Delivered"
    CANCELLED = "Cancelled"

class OrderItemSchema(BaseModel):
    name: str = Field(..., example="Lorem Apex Headphones")
    qty: int = Field(..., ge=1, example=1)
    price: float = Field(..., gt=0, example=249.99)

class OrderCreate(BaseModel):
    items: List[OrderItemSchema]
    total: float = Field(..., gt=0, example=249.99)
    customer: str = Field(..., example="Lorem Customer")
    email: EmailStr = Field(..., example="customer@shopground.era")
    shipping_address: str = Field(..., example="124 Lorem Avenue, San Francisco, CA 94107")

class OrderStatusUpdate(BaseModel):
    status: OrderStatus
    courier: Optional[str] = Field(None, example="FedEx Express")
    awb_number: Optional[str] = Field(None, example="AWB-99824102")

class OrderInDB(OrderCreate):
    id: str = Field(alias="_id")
    date: str
    status: OrderStatus = OrderStatus.PROCESSING
    courier: Optional[str] = "FedEx Express"
    awb_number: Optional[str] = "AWB-99824102"
    warehouse: Optional[str] = "Warehouse Alpha (US-West)"
