from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.middleware.gzip import GZipMiddleware
from app.core.config import settings
from app.core.database import connect_to_mongo, close_mongo_connection
from app.core.redis import connect_to_redis, close_redis_connection

from app.routes.auth import router as auth_router
from app.routes.products import router as products_router
from app.routes.orders import router as orders_router
from app.routes.cart import router as cart_router
from app.routes.categories import router as categories_router
from app.routes.payments import router as payments_router
from app.routes.logistics import router as logistics_router
from app.routes.inventory import router as inventory_router
from app.routes.analytics import router as analytics_router
from app.routes.media import router as media_router
from app.routes.inquiries import router as inquiries_router
from app.routes.health import router as health_router

app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    openapi_url=f"{settings.API_V1_STR}/openapi.json",
    docs_url="/docs",
    redoc_url="/redoc",
)

# Enable GZip Compression for all responses > 500 bytes
app.add_middleware(GZipMiddleware, minimum_size=500)

# Configure CORS Middleware for myapp.com and admin.myapp.com
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Connection Lifecycles
@app.on_event("startup")
async def startup_event():
    await connect_to_mongo()
    await connect_to_redis()

@app.on_event("shutdown")
async def shutdown_event():
    await close_mongo_connection()
    await close_redis_connection()

# Include Routers under /api/v1
app.include_router(auth_router, prefix=settings.API_V1_STR)
app.include_router(products_router, prefix=settings.API_V1_STR)
app.include_router(inquiries_router, prefix=settings.API_V1_STR)
app.include_router(orders_router, prefix=settings.API_V1_STR)
app.include_router(cart_router, prefix=settings.API_V1_STR)
app.include_router(categories_router, prefix=settings.API_V1_STR)
app.include_router(payments_router, prefix=settings.API_V1_STR)
app.include_router(logistics_router, prefix=settings.API_V1_STR)
app.include_router(inventory_router, prefix=settings.API_V1_STR)
app.include_router(analytics_router, prefix=settings.API_V1_STR)
app.include_router(media_router, prefix=settings.API_V1_STR)
app.include_router(health_router, prefix=settings.API_V1_STR)

@app.get("/")
async def root():
    return {
        "message": "Welcome to ShopGround Era Enterprise FastAPI Engine",
        "docs": "/docs",
        "health": f"{settings.API_V1_STR}/health"
    }
