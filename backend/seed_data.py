"""
ShopGround Era — GroundEra Anti-Vibration Pads Production Seed Script
Seeds the actual flagship product (GroundEra Anti-Vibration Pads, ObjectId: 66a87f12bc09a123456789ab)
with exact Amazon-grade specifications from the product media and Cloudinary CDN assets.

Usage:
  python3 seed_data.py
"""

import asyncio
from motor.motor_asyncio import AsyncIOMotorClient

MONGODB_URL = "mongodb://localhost:27017"
DATABASE_NAME = "shopground_db"

def _cdn(public_id: str, width: int = 1200) -> str:
    return (
        f"https://res.cloudinary.com/dnay8iqz3/image/upload"
        f"/f_auto,q_auto,w_{width}/shopground/products/{public_id}.png"
    )

CDN = {
    "main":    _cdn("apex_pro_main"),
    "angle":   _cdn("apex_pro_angle"),
    "feature": _cdn("apex_pro_feature"),
    "banner1": _cdn("apex_pro_banner1"),
    "banner2": _cdn("apex_pro_banner2"),
}

PRODUCT = {
    "_id": "66a87f12bc09a123456789ab",
    "id": "66a87f12bc09a123456789ab",
    "asin": "B0H915VTB1",
    "amazon_url": "https://www.amazon.com/dp/B0H915VTB1",
    "name": "GroundEra Anti-Vibration Pads with Leveling Shim & Mini Level",
    "model_number": "GE-PADS-800",
    "manufacturer": "GroundEra Hardware Corp.",
    "subtitle": "The Ultimate Stability Solution — Stackable Heavy-Duty Appliance Isolators",
    "short_description": "Heavy-duty anti-vibration pads featuring an innovative stackable design, high-traction honeycomb grip texture, 800 lb load rating, and precision leveling shims with a mini bubble level.",
    "long_description": (
        "Engineered to eliminate appliance walking, floor scuffs, and loud structural vibration. "
        "GroundEra Anti-Vibration Pads feature an innovative stackable modular system allowing "
        "custom height adjustments for perfect appliance balance. Constructed with a heavy-duty "
        "impact-resistant polymer compound and high-grip honeycomb surface texture rated for up to 800 lbs. "
        "Includes precision leveling shims and a keychain mini spirit level tool for easy, accurate installation."
    ),
    "price": 29.99,
    "wholesale_mrp": 39.99,
    "discount_percent": 25.00,
    "moq": 10,
    "category": "Home & Appliance Hardware",
    "brand": "GroundEra",
    "stock": 2500,
    "image": CDN["main"],
    "images": [
        CDN["main"],
        CDN["angle"],
        CDN["feature"],
        CDN["banner1"],
        CDN["banner2"],
    ],
    "cloudinary_public_ids": {
        "main": "shopground/products/apex_pro_main",
        "angle": "shopground/products/apex_pro_angle",
        "feature": "shopground/products/apex_pro_feature",
        "banner1": "shopground/products/apex_pro_banner1",
        "banner2": "shopground/products/apex_pro_banner2",
    },

    "tech_specs": {
        "Load Rating": "800 lbs Weight Capacity",
        "Design System": "Innovative Stackable Height System",
        "Surface Grip Texture": "High-Density Honeycomb Anti-Slip Structure",
        "Leveling Tools Included": "Precision Leveling Shim & Keychain Mini Spirit Level",
        "Noise & Vibration Reduction": "Heavy-Duty Acoustic Dampening Elastomer",
        "Appliance Compatibility": "Washing Machines, Dryers, Ovens, Treadmills, Heavy Furniture",
        "Floor Protection": "Tile, Hardwood, Vinyl, Concrete, Laminate",
        "Dimensions": "4.3 x 4.3 x 1.5 inches per pad",
        "Warranty": "Lifetime Manufacturer Warranty",
    },

    "box_contents": [
        "4x GroundEra Stackable Heavy-Duty Anti-Vibration Pads",
        "1x Precision Fine-Tuning Leveling Shim",
        "1x Portable Keychain Mini Spirit Level Tool",
        "1x Installation & Height Adjustment Guide",
    ],

    "key_highlights": [
        "Innovative Stackable Modular Design for Customizable Height",
        "800 LB Load Capacity for Heavy Commercial Washers & Dryers",
        "High-Traction Honeycomb Pattern Prevents Appliance Walking & Slipping",
        "Includes Precision Leveling Shim & Mini Spirit Level Tool",
        "Lifetime Manufacturer Warranty & All-Surface Floor Protection",
    ],

    "variants": [
        {"sku": "GE-PADS-4PK", "color": "Industrial Grey / Black", "stock": 1500, "price": 29.99},
        {"sku": "GE-PADS-8PK", "color": "Industrial Grey / Black (8-Pack)", "stock": 1000, "price": 49.99},
    ],

    "distribution_contact": {
        "department": "GroundEra Wholesale & Distribution",
        "email": "employee.sales@shopground.era",
        "phone": "+1 (800) 555-GROUNDERA",
        "lead_time": "1-2 Business Days for Sample Shipping",
    },

    "is_flagship": True,
    "status": "Active",
}

async def seed():
    print("=== ShopGround Era — GroundEra Anti-Vibration Pads MongoDB Seed ===\n")
    client = AsyncIOMotorClient(MONGODB_URL)
    db = client[DATABASE_NAME]

    print("Clearing database collections...")
    await db["products"].delete_many({})
    await db["inquiries"].delete_many({})
    await db["orders"].delete_many({})

    print("Inserting GroundEra Anti-Vibration Pads Product (ID: 66a87f12bc09a123456789ab)...")
    await db["products"].insert_one(PRODUCT)

    print("\nMongoDB seed completed successfully!")
    print(f"  Product Name: {PRODUCT['name']}")
    print(f"  MongoDB _id : {PRODUCT['_id']}")
    print(f"  Cloudinary  : {PRODUCT['image']}")
    client.close()

if __name__ == "__main__":
    asyncio.run(seed())
