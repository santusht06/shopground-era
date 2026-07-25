from pydantic import BaseModel
from typing import List, Optional

class OrderItem(BaseModel):
    name: str
    qty: int
    price: float

class OrderCreate(BaseModel):
    items: List[OrderItem]
    shippingAddress: str
    total: float

class OrderResponse(BaseModel):
    id: str
    date: str
    total: float
    status: str
    itemsCount: int
    items: List[OrderItem]
    shippingAddress: str
