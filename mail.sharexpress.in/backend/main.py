"""
mail.sharexpress.in — FastAPI Backend Entry Point
Private enterprise mail platform for ShareXpress.
"""
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.middleware.trustedhost import TrustedHostMiddleware
from contextlib import asynccontextmanager

from app.config import settings
from app.database import connect_db, close_db
from app.api.v1.router import api_router
from app.seed import seed_admin


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Startup and shutdown lifecycle."""
    await connect_db()
    await seed_admin()
    
    # Ensure S3 attachment bucket exists
    from app.services.attachment_service import AttachmentService
    await AttachmentService.ensure_bucket()
    
    yield
    await close_db()


app = FastAPI(
    title="mail.sharexpress.in API",
    description="Private enterprise mail platform REST API — ShareXpress Internal",
    version="1.0.0",
    docs_url="/docs" if settings.PROJECT_ENV != "production" else None,
    redoc_url="/redoc" if settings.PROJECT_ENV != "production" else None,
    lifespan=lifespan,
)

# ─── Middleware ────────────────────────────────────────────────────────────────

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS.split(","),
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.add_middleware(
    TrustedHostMiddleware,
    allowed_hosts=["mail.sharexpress.in", "api.mail.sharexpress.in", "localhost", "127.0.0.1"],
)

# ─── API Routes ────────────────────────────────────────────────────────────────

app.include_router(api_router, prefix="/api/v1")


@app.get("/health", tags=["health"])
async def health():
    return {"status": "ok", "service": "mail.sharexpress.in"}
