from fastapi import APIRouter, Query
from pydantic import BaseModel, Field
from app.services.cloudinary_service import generate_signed_upload_params, build_cloudinary_url

router = APIRouter(prefix="/media", tags=["Cloudinary Media Engine"])

class SignedUploadResponse(BaseModel):
    signature: str
    timestamp: int
    api_key: str
    cloud_name: str
    folder: str
    upload_url: str

class TransformUrlRequest(BaseModel):
    public_id: str = Field(..., example="shopground/products/apex_hd_1")
    width: int = Field(600, example=600)
    height: int = Field(600, example=600)
    crop: str = Field("fill", example="fill")

@router.post("/sign-upload", response_model=SignedUploadResponse)
async def get_cloudinary_upload_signature(folder: str = Query("shopground/products", description="Cloudinary storage folder")):
    """
    Generate SHA-1 security signature for direct client-side (React Frontend) uploads to Cloudinary CDN.
    """
    signed_params = generate_signed_upload_params(folder=folder)
    return signed_params

@router.post("/transform-url")
async def get_transformed_cloudinary_url(req: TransformUrlRequest):
    """
    Generate optimized Cloudinary image CDN URL with WebP/AVIF auto-format and smart quality compression.
    """
    cdn_url = build_cloudinary_url(
        public_id=req.public_id,
        width=req.width,
        height=req.height,
        crop=req.crop
    )
    return {"public_id": req.public_id, "cdn_url": cdn_url}
