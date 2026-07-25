from pydantic import BaseModel, Field
from typing import List, Optional

class ProductBase(BaseModel):
    name: str
    subtitle: Optional[str] = None
    price: float
    originalPrice: Optional[float] = None
    category: str
    rating: float = 5.0
    reviewsCount: int = 0
    image: str
    description: str
    specs: List[str] = []
    isFeatured: bool = False
    isNew: bool = False
    stock: int = 10

class ProductCreate(ProductBase):
    id: str

class ProductResponse(ProductBase):
    id: str

    class Config:
        from_attributes = True
