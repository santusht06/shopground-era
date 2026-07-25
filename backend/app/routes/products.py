from fastapi import APIRouter, HTTPException, Query, status
from typing import List, Optional
from app.models.product import ProductBase, ProductCreate, ProductUpdate, ProductInDB
from app.core.database import get_database

router = APIRouter(prefix="/products", tags=["Product Catalog"])

# Initial fallback catalog if database is empty
DEMO_PRODUCTS = [
    {
        "_id": "prod-101",
        "name": "Lorem Apex Headphones",
        "subtitle": "Wireless Active Noise Cancelling Audio",
        "description": "High-fidelity audio engineered with active noise cancellation and 30-hour battery life.",
        "price": 249.99,
        "original_price": 299.99,
        "category": "Electronics",
        "brand": "Apex Audio",
        "stock": 18,
        "rating": 4.9,
        "reviews_count": 128,
        "image": "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=600&q=80",
        "specs": ["Bluetooth 5.3", "30-Hour Battery", "Active ANC"],
        "variants": [{"sku": "HD-BLK", "color": "Midnight Black", "stock": 10, "price": 249.99}],
        "is_new": True,
        "status": "Active"
    },
    {
        "_id": "prod-102",
        "name": "Ipsum Minimalist Chronograph",
        "subtitle": "Brushed Stainless Steel Timepiece",
        "description": "Minimalist sapphire crystal chronograph with genuine leather strap.",
        "price": 189.00,
        "original_price": 220.00,
        "category": "Accessories",
        "brand": "Chrono Craft",
        "stock": 12,
        "rating": 4.8,
        "reviews_count": 94,
        "image": "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=600&q=80",
        "specs": ["Sapphire Crystal", "50m Water Resistance"],
        "variants": [],
        "is_new": False,
        "status": "Active"
    }
]

@router.get("", response_model=List[ProductInDB])
async def list_products(
    category: Optional[str] = Query(None, description="Filter by product category"),
    search: Optional[str] = Query(None, description="Search term in title or description")
):
    """
    Retrieve product catalog with optional search and category filters.
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
    Retrieve single product details by ID.
    """
    db = get_database()
    if db:
        product = await db.products.find_one({"_id": product_id})
        if product:
            product["_id"] = str(product["_id"])
            return product

    for p in DEMO_PRODUCTS:
        if p["_id"] == product_id:
            return p

    raise HTTPException(status_code=404, detail=f"Product with ID {product_id} not found.")

@router.post("", response_model=ProductInDB, status_code=status.HTTP_201_CREATED)
async def create_product(product_data: ProductCreate):
    """
    Add a new product to the catalog.
    """
    db = get_database()
    product_dict = product_data.dict()
    product_dict["_id"] = f"prod-{int(status.HTTP_201_CREATED)}"

    if db:
        res = await db.products.insert_one(product_dict)
        product_dict["_id"] = str(res.inserted_id)

    return product_dict
