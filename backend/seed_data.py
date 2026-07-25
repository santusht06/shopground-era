import asyncio
from motor.motor_asyncio import AsyncIOMotorClient

MONGODB_URL = "mongodb://localhost:27017"
DATABASE_NAME = "shopground_db"

PRODUCTS = [
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
        "description": "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut elit tellus, luctus nec ullamcorper mattis.",
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
    },
    {
        "id": "prod-103",
        "name": "Dolor Smart Ergonomics Chair",
        "subtitle": "Lumbar Support Executive Desk Seat",
        "price": 450.00,
        "originalPrice": 520.00,
        "category": "Furniture",
        "rating": 4.7,
        "reviewsCount": 65,
        "image": "https://images.unsplash.com/photo-1580481072645-022f9a6d85d5?auto=format&fit=crop&w=600&q=80",
        "description": "Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.",
        "specs": ["Dynamic Lumbar Support", "Breathable Mesh Back"],
        "isFeatured": True,
        "isNew": True,
        "stock": 8
    }
]

async def seed():
    client = AsyncIOMotorClient(MONGODB_URL)
    db = client[DATABASE_NAME]

    print("Clearing existing products...")
    await db["products"].delete_many({})

    print("Inserting seed products...")
    await db["products"].insert_many(PRODUCTS)
    print("Seed completed successfully!")
    client.close()

if __name__ == "__main__":
    asyncio.run(seed())
