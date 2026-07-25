from typing import List, Optional
from pydantic import BaseModel, Field

class ProductVariant(BaseModel):
    sku: str = Field(..., example="HD-BLK")
    color: str = Field(..., example="Midnight Black")
    stock: int = Field(..., ge=0, example=10)
    price: float = Field(..., gt=0, example=249.99)

class ProductBase(BaseModel):
    name: str = Field(..., example="Lorem Apex Headphones")
    subtitle: Optional[str] = Field(None, example="Wireless Active Noise Cancelling Audio")
    description: Optional[str] = Field(None, example="High-fidelity audio engineered with active noise cancellation.")
    price: float = Field(..., gt=0, example=249.99)
    original_price: Optional[float] = Field(None, example=299.99)
    category: str = Field(..., example="Electronics")
    brand: Optional[str] = Field("Apex Audio", example="Apex Audio")
    stock: int = Field(10, ge=0, example=18)
    rating: float = Field(4.9, ge=0, le=5.0, example=4.9)
    reviews_count: int = Field(128, ge=0, example=128)
    image: str = Field(..., example="https://images.unsplash.com/photo-1505740420928-5e560c06d30e")
    specs: List[str] = Field(default_factory=list, example=["Bluetooth 5.3", "30-Hour Battery", "Active ANC"])
    variants: List[ProductVariant] = Field(default_factory=list)
    is_new: bool = Field(True, example=True)
    status: str = Field("Active", example="Active")

class ProductCreate(ProductBase):
    pass

class ProductUpdate(BaseModel):
    name: Optional[str] = None
    price: Optional[float] = None
    stock: Optional[int] = None
    category: Optional[str] = None
    status: Optional[str] = None

class ProductInDB(ProductBase):
    id: str = Field(alias="_id")
