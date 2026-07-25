from fastapi import APIRouter
from typing import List

router = APIRouter(prefix="/categories", tags=["Categories"])

CATEGORIES = [
    "All",
    "Electronics",
    "Fashion",
    "Furniture",
    "Accessories",
    "Home & Kitchen"
]

@router.get("", response_model=List[str])
async def get_categories():
    return CATEGORIES
