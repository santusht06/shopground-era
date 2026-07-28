import asyncio
from motor.motor_asyncio import AsyncIOMotorClient

MONGODB_URL = "mongodb://localhost:27017"
DATABASE_NAME = "shopground_db"

AMAZON_PRODUCT_B0H915VTB1 = {
    "_id": "B0H915VTB1",
    "name": "Apex Pro Wireless Active Noise Cancelling Headphones",
    "subtitle": "ASIN: B0H915VTB1 — Premium Studio Grade Audio",
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
        "ASIN: B0H915VTB1"
    ],
    "variants": [
        {"sku": "B0H915VTB1-BLK", "color": "Midnight Black", "stock": 14, "price": 249.99},
        {"sku": "B0H915VTB1-SLV", "color": "Silver Alum", "stock": 10, "price": 249.99}
    ],
    "is_new": True,
    "status": "Active"
}

CATEGORIES = [
    {
        "_id": "cat_audio_gear",
        "name": "Audio Gear",
        "slug": "audio-gear",
        "description": "Flagship wireless headphones, ANC headsets, and studio monitors.",
        "image": "/images/product/main.png"
    },
    {
        "_id": "cat_anc_headsets",
        "name": "Active Noise Cancelling",
        "slug": "anc-headsets",
        "description": "Advanced hybrid ANC headsets for work and travel.",
        "image": "/images/product/banner1.png"
    },
    {
        "_id": "cat_wireless_audio",
        "name": "Wireless Audio",
        "slug": "wireless-audio",
        "description": "High-fidelity Bluetooth 5.3 audio devices.",
        "image": "/images/product/angle.png"
    }
]

ORDERS = [
    {
        "_id": "ORD-89241",
        "date": "2026-07-25",
        "total": 249.99,
        "status": "Processing",
        "courier": "FedEx Express",
        "awb_number": "AWB-99824102",
        "warehouse": "Warehouse Alpha (US-West)",
        "customer": "Lorem Customer",
        "email": "customer@shopground.era",
        "shipping_address": "124 Lorem Avenue, San Francisco, CA 94107",
        "items": [{"name": "Apex Pro Wireless ANC Headphones (ASIN: B0H915VTB1)", "qty": 1, "price": 249.99}]
    }
]

async def seed():
    client = AsyncIOMotorClient(MONGODB_URL)
    db = client[DATABASE_NAME]

    print("Clearing existing database collections...")
    await db["products"].delete_many({})
    await db["categories"].delete_many({})
    await db["orders"].delete_many({})

    print("Inserting Amazon Product B0H915VTB1...")
    await db["products"].insert_one(AMAZON_PRODUCT_B0H915VTB1)

    print("Inserting Audio Taxonomy Categories...")
    await db["categories"].insert_many(CATEGORIES)

    print("Inserting Sample Orders...")
    await db["orders"].insert_many(ORDERS)

    print("MongoDB seed completed successfully!")
    client.close()

if __name__ == "__main__":
    asyncio.run(seed())
