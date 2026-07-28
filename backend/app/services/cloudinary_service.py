import time
import cloudinary
import cloudinary.uploader
import cloudinary.utils
from app.core.config import settings

# Initialize Cloudinary configuration
cloudinary.config(
    cloud_name=settings.CLOUDINARY_CLOUD_NAME,
    api_key=settings.CLOUDINARY_API_KEY,
    api_secret=settings.CLOUDINARY_API_SECRET,
    secure=True
)

def generate_signed_upload_params(folder: str = "shopground/products"):
    """
    Generate SHA-1 signature and timestamp for direct client-side (React Frontend) Cloudinary uploads.
    Prevents bottlenecking application backend with heavy image binary streams.
    """
    timestamp = int(time.time())
    params_to_sign = {
        "timestamp": timestamp,
        "folder": folder,
    }
    
    signature = cloudinary.utils.api_sign_request(
        params_to_sign,
        settings.CLOUDINARY_API_SECRET
    )

    return {
        "signature": signature,
        "timestamp": timestamp,
        "api_key": settings.CLOUDINARY_API_KEY,
        "cloud_name": settings.CLOUDINARY_CLOUD_NAME,
        "folder": folder,
        "upload_url": f"https://api.cloudinary.com/v1_1/{settings.CLOUDINARY_CLOUD_NAME}/image/upload"
    }

def build_cloudinary_url(public_id: str, width: int = 600, height: int = 600, crop: str = "fill") -> str:
    """
    Build high-performance, responsive Cloudinary image URLs with automatic WebP/AVIF formatting
    and intelligent quality compression (f_auto, q_auto).
    """
    if not public_id:
        return "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=600&q=80"
    
    if public_id.startswith("http://") or public_id.startswith("https://"):
        return public_id

    url, _ = cloudinary.utils.cloudinary_url(
        public_id,
        width=width,
        height=height,
        crop=crop,
        fetch_format="auto",
        quality="auto",
        secure=True
    )
    return url
