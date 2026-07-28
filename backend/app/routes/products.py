from fastapi import APIRouter, HTTPException, Query, status
from typing import List, Optional
from app.models.product import ProductBase, ProductCreate, ProductUpdate, ProductInDB
from app.core.database import get_database

router = APIRouter(prefix="/products", tags=["Product Catalog"])


def _serialize(doc: dict) -> dict:
    """Convert MongoDB _id to string and normalize field names for API response."""
    doc["_id"] = str(doc.get("_id", ""))
    # Map snake_case DB fields → camelCase API surface
    if "original_price" in doc and "originalPrice" not in doc:
        doc["originalPrice"] = doc.pop("original_price")
    if "reviews_count" in doc and "reviewsCount" not in doc:
        doc["reviewsCount"] = doc.pop("reviews_count")
    if "is_new" in doc and "isNew" not in doc:
        doc["isNew"] = doc.pop("is_new")
    return doc


@router.get("")
async def list_products(
    category: Optional[str] = Query(None, description="Filter by product category"),
    search: Optional[str] = Query(None, description="Search term in title or description"),
    limit: int = Query(50, ge=1, le=100),
):
    """
    Retrieve product catalog from MongoDB. Images served from Cloudinary CDN URLs.
    """
    db = get_database()
    if db is None:
        raise HTTPException(status_code=503, detail="Database unavailable")

    query: dict = {}
    if category and category.lower() != "all":
        query["category"] = category
    if search:
        query["$or"] = [
            {"name": {"$regex": search, "$options": "i"}},
            {"description": {"$regex": search, "$options": "i"}},
            {"category": {"$regex": search, "$options": "i"}},
        ]

    cursor = db.products.find(query)
    products = await cursor.to_list(length=limit)
    return [_serialize(p) for p in products]


@router.get("/{product_id}")
async def get_product(product_id: str):
    """
    Retrieve single product by MongoDB ObjectId or ASIN.
    Images are served as Cloudinary CDN secure_url strings stored in MongoDB.
    """
    db = get_database()
    if db is None:
        raise HTTPException(status_code=503, detail="Database unavailable")

    product = await db.products.find_one(
        {"$or": [{"_id": product_id}, {"id": product_id}, {"asin": product_id}]}
    )
    if not product:
        raise HTTPException(status_code=404, detail=f"Product '{product_id}' not found.")

    return _serialize(product)


@router.post("", status_code=status.HTTP_201_CREATED)
async def create_product(product_data: ProductCreate):
    """
    Add a new product. Image URLs should be Cloudinary CDN secure_urls.
    """
    db = get_database()
    if db is None:
        raise HTTPException(status_code=503, detail="Database unavailable")

    product_dict = product_data.dict()
    res = await db.products.insert_one(product_dict)
    product_dict["_id"] = str(res.inserted_id)
    return _serialize(product_dict)


@router.patch("/{product_id}")
async def update_product(product_id: str, updates: ProductUpdate):
    """
    Partially update a product (e.g., update Cloudinary image URLs after re-upload).
    """
    db = get_database()
    if db is None:
        raise HTTPException(status_code=503, detail="Database unavailable")

    update_dict = {k: v for k, v in updates.dict().items() if v is not None}
    if not update_dict:
        raise HTTPException(status_code=400, detail="No fields provided for update.")

    result = await db.products.update_one(
        {"$or": [{"_id": product_id}, {"id": product_id}]},
        {"$set": update_dict}
    )
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail=f"Product '{product_id}' not found.")

    updated = await db.products.find_one({"$or": [{"_id": product_id}, {"id": product_id}]})
    return _serialize(updated)


@router.delete("/{product_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_product(product_id: str):
    """Delete product from catalog."""
    db = get_database()
    if db is None:
        raise HTTPException(status_code=503, detail="Database unavailable")

    result = await db.products.delete_one(
        {"$or": [{"_id": product_id}, {"id": product_id}]}
    )
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail=f"Product '{product_id}' not found.")
