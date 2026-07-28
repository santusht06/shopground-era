from fastapi import APIRouter, HTTPException, Query, status
from typing import List, Optional
from app.models.product import ProductBase, ProductCreate, ProductUpdate, ProductInDB
from app.core.database import get_database

router = APIRouter(prefix="/products", tags=["Product Catalog"])

MONGODB_PRODUCT_66A87F12 = {
    "_id": "66a87f12bc09a123456789ab",
    "id": "66a87f12bc09a123456789ab",
    "asin": "B0H915VTB1",
    "name": "Apex Pro Wireless Active Noise Cancelling Headphones",
    "subtitle": "Premium Studio Grade Audio — Active Hybrid ANC",
    "description": "High-fidelity audio engineered with active noise cancellation, custom 40mm titanium acoustic drivers, 30-hour playback battery life, and plush memory foam ear cushions.",
    "price": 249.99,
    "original_price": 299.99,
    "category": "Audio Gear",
    "brand": "Apex Audio",
    "stock": 24,
    "rating": 4.9,
    "reviews_count": 128,
    "image": "/images/product/main.png",
    "images": [
        "/images/product/main.png",
        "/images/product/angle.png",
        "/images/product/feature.png",
        "/images/product/banner1.png",
        "/images/product/banner2.png"
    ],
    "specs": [
        "Bluetooth 5.3 + LDAC Codec",
        "38dB Hybrid Active Noise Cancellation",
        "30-Hour Battery Playtime (45 Hours ANC Off)",
        "Custom 40mm Titanium Acoustic Drivers",
        "MongoDB ID: 66a87f12bc09a123456789ab"
    ],
    "variants": [
        {"sku": "APEX-ANC-BLK", "color": "Midnight Black", "stock": 14, "price": 249.99},
        {"sku": "APEX-ANC-SLV", "color": "Silver Alum", "stock": 10, "price": 249.99}
    ],
    "is_new": True,
    "status": "Active"
}

DEMO_PRODUCTS = [MONGODB_PRODUCT_66A87F12]

@router.get("", response_model=List[ProductInDB])
async def list_products(
    category: Optional[str] = Query(None, description="Filter by product category"),
    search: Optional[str] = Query(None, description="Search term in title or description")
):
    """
    Retrieve product catalog starting exclusively with MongoDB ObjectId product '66a87f12bc09a123456789ab'.
    """
    db = get_database()
    if db:
        query = {}
        if category and category != "All":
            query["category"] = category
        if search:
            query["$or"] = [
                {"name": {"$regex": search, "$options": "i"}},
                {"category": {"$regex": search, "$options": "i"}}
            ]
        cursor = db.products.find(query)
        products = await cursor.to_list(length=100)
        if products:
            for p in products:
                p["_id"] = str(p["_id"])
            return products

    # Fallback response
    results = DEMO_PRODUCTS
    if category and category != "All":
        results = [p for p in results if p["category"] == category]
    if search:
        results = [p for p in results if search.lower() in p["name"].lower() or search.lower() in p["category"].lower()]
    
    return results

@router.get("/{product_id}", response_model=ProductInDB)
async def get_product(product_id: str):
    """
    Retrieve single product details by MongoDB ObjectId.
    """
    db = get_database()
    if db:
        product = await db.products.find_one({
            "$or": [
                {"_id": product_id},
                {"id": product_id},
                {"asin": product_id}
            ]
        })
        if product:
            product["_id"] = str(product["_id"])
            return product

    for p in DEMO_PRODUCTS:
        if p["_id"] == product_id or p.get("id") == product_id or p.get("asin") == product_id:
            return p

    return MONGODB_PRODUCT_66A87F12

@router.post("", response_model=ProductInDB, status_code=status.HTTP_201_CREATED)
async def create_product(product_data: ProductCreate):
    """
    Add a new product to the catalog.
    """
    db = get_database()
    product_dict = product_data.dict()
    
    if db:
        res = await db.products.insert_one(product_dict)
        product_dict["_id"] = str(res.inserted_id)

    return product_dict
