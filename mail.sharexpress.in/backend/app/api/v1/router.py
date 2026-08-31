"""API v1 router — aggregates all route modules."""
from fastapi import APIRouter
from app.api.v1 import auth, mail, admin, settings as settings_router

api_router = APIRouter()

api_router.include_router(auth.router, prefix="/auth", tags=["Authentication"])
api_router.include_router(mail.router, prefix="/mail", tags=["Mail"])
api_router.include_router(admin.router, prefix="/admin", tags=["Admin"])
api_router.include_router(settings_router.router, prefix="/settings", tags=["Settings"])
