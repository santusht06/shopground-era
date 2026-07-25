from pydantic import BaseModel
from typing import List, Optional

class CartItem(BaseModel):
    id: str
    name: str
    price: float
    quantity: int
    image: str
    category: str

class CartUpdate(BaseModel):
    user_id: str = "guest_session"
    items: List[CartItem]
    couponCode: Optional[str] = None
