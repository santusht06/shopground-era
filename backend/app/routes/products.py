from fastapi import APIRouter, Query, HTTPException
from typing import List, Optional
import json
from app.models.product import ProductResponse
from app.core.database import get_database
from app.core.redis import get_redis

router = APIRouter(prefix="/products", tags=["Products"])

# Sample fallback products in case MongoDB is empty
FALLBACK_PRODUCTS = [
    {
        "id": "prod-101",
        "name": "Lorem Apex Headphones",
        "subtitle": "Wireless Active Noise Cancelling Audio",
        "price": 249.99,
        "originalPrice": 299.99,
        "category": "Electronics",
        "rating": 4.8,
        "reviewsCount": 124,
        "image": "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=600&q=80",
        "description": "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Premium acoustic drivers deliver ultra-rich sound clarity.",
        "specs": ["Bluetooth 5.3", "35-Hour Battery Life", "Active Noise Cancellation"],
        "isFeatured": True,
        "isNew": True,
        "stock": 18
    },
    {
        "id": "prod-102",
        "name": "Ipsum Minimalist Chronograph",
        "subtitle": "Brushed Stainless Steel Timepiece",
        "price": 189.00,
        "originalPrice": 220.00,
        "category": "Accessories",
        "rating": 4.9,
        "reviewsCount": 89,
        "image": "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=600&q=80",
        "description": "Lorem ipsum dolor sit amet, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
        "specs": ["Japanese Quartz Movement", "5 ATM Water Resistant"],
        "isFeatured": True,
        "isNew": False,
        "stock": 12
    }
]

@router.get("", response_model=List[ProductResponse])
async def list_products(
    category: Optional[str] = Query(None),
    search: Optional[str] = Query(None),
):
    redis = get_redis()
    cache_key = f"products:{category or 'all'}:{search or 'all'}"

    # Check Redis Cache
    if redis:
        try:
            cached_data = await redis.get(cache_key)
            if cached_data:
                return json.loads(cached_data)
        except Exception:
            pass

    db = get_database()
    products = []
    if db is not None:
        try:
            query = {}
            if category and category != "All":
                query["category"] = category
            if search:
                query["name"] = {"$regex": search, "$options": "i"}

            cursor = db["products"].find(query)
            async for doc in cursor:
                doc["_id"] = str(doc.get("_id", ""))
                products.append(doc)
        except Exception:
            products = FALLBACK_PRODUCTS
    else:
        products = FALLBACK_PRODUCTS

    if not products:
        products = FALLBACK_PRODUCTS

    # Cache result in Redis for 60 seconds
    if redis:
        try:
            await redis.setex(cache_key, 60, json.dumps(products))
        except Exception:
            pass

    return products

@router.get("/{product_id}", response_model=ProductResponse)
async def get_product(product_id: str):
    db = get_database()
    if db is not None:
        try:
            product = await db["products"].find_one({"id": product_id})
            if product:
                return product
        except Exception:
            pass

    for p in FALLBACK_PRODUCTS:
        if p["id"] == product_id:
            return p

    raise HTTPException(status_code=404, detail="Product not found")
