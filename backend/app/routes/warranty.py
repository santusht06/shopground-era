import uuid
import os
from datetime import datetime, timedelta, timezone
from typing import List, Optional
from fastapi import APIRouter, HTTPException, status, Query, UploadFile, File
from app.core.database import get_database
from app.models.warranty import (
    WarrantyRegisterCreate,
    WarrantyClaimCreate,
    WarrantyAdminUpdate,
    ClaimAdminUpdate,
    WarrantyStatus,
    ClaimStatus
)

router = APIRouter(tags=["Warranty System"])

def generate_code(prefix: str) -> str:
    return f"{prefix}-{uuid.uuid4().hex[:8].upper()}"

# MinIO evidence data directory path
MINIO_EVIDENCE_DIR = "/var/lib/minio/data/warranty-evidence"

# ─── FILE UPLOAD ENDPOINT (MINIO STORAGE) ───────────────────────────────────

@router.post("/warranty/upload-evidence")
async def upload_warranty_evidence(file: UploadFile = File(...)):
    # Validate content type (images and videos)
    allowed_types = ["image/jpeg", "image/png", "image/webp", "video/mp4", "video/webm", "video/quicktime"]
    if file.content_type not in allowed_types:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Unsupported file type ({file.content_type}). Please upload JPG, PNG, WEBP images or MP4, WEBM videos."
        )

    # Ensure MinIO evidence directory exists
    os.makedirs(MINIO_EVIDENCE_DIR, exist_ok=True)

    # Generate unique filename
    ext = os.path.splitext(file.filename)[1] or ".jpg"
    unique_filename = f"evidence_{uuid.uuid4().hex[:12]}{ext}"
    file_path = os.path.join(MINIO_EVIDENCE_DIR, unique_filename)

    # Read and save file content
    contents = await file.read()
    with open(file_path, "wb") as f:
        f.write(contents)

    # Set permissions so MinIO process can serve it
    try:
        os.chmod(file_path, 0o644)
    except Exception:
        pass

    public_url = f"https://shopgroundera.com/minio/warranty-evidence/{unique_filename}"

    return {
        "success": True,
        "filename": unique_filename,
        "url": public_url,
        "content_type": file.content_type
    }

# ─── PUBLIC WARRANTY ENDPOINTS ────────────────────────────────────────────────

@router.post("/warranty/register", status_code=status.HTTP_201_CREATED)
async def register_warranty(payload: WarrantyRegisterCreate):
    db = get_database()
    
    # Check if serial number or order ID has active warranty
    existing = await db.warranties.find_one({
        "$or": [
            {"serial_number": payload.serial_number},
            {"order_id": payload.order_id, "email": payload.email}
        ]
    })
    
    if existing:
        return {
            "success": True,
            "message": "Lifetime Warranty already registered for this Serial Number or Order ID.",
            "warranty_code": existing["warranty_code"],
            "status": existing.get("status", WarrantyStatus.APPROVED.value),
            "registered_at": existing["registered_at"],
            "expires_at": "Lifetime Guarantee"
        }

    warranty_code = generate_code("WRN")
    now = datetime.now(timezone.utc)

    doc = {
        "warranty_code": warranty_code,
        "order_id": payload.order_id,
        "product_name": payload.product_name,
        "customer_name": payload.customer_name,
        "email": payload.email,
        "phone": payload.phone,
        "serial_number": payload.serial_number,
        "purchase_date": payload.purchase_date,
        "duration_months": 1200,  # Lifetime
        "status": WarrantyStatus.APPROVED.value,  # Auto-activate Lifetime Warranty
        "invoice_url": payload.invoice_url,
        "registered_at": now.strftime("%Y-%m-%d %H:%M UTC"),
        "expires_at": "Lifetime Guarantee",
        "created_timestamp": now.timestamp()
    }

    await db.warranties.insert_one(doc)
    
    return {
        "success": True,
        "message": "Lifetime Warranty registered successfully! Your GroundEra™ Lifetime Guarantee is now active.",
        "warranty_code": warranty_code,
        "status": WarrantyStatus.APPROVED.value,
        "expires_at": "Lifetime Guarantee"
    }


@router.get("/warranty/verify/{warranty_code}")
async def verify_warranty(warranty_code: str):
    db = get_database()
    warranty = await db.warranties.find_one({"warranty_code": warranty_code.strip().upper()})
    
    if not warranty:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Warranty record for code '{warranty_code}' not found."
        )

    return {
        "warranty_code": warranty["warranty_code"],
        "order_id": warranty["order_id"],
        "product_name": warranty["product_name"],
        "customer_name": warranty["customer_name"],
        "email": warranty["email"],
        "serial_number": warranty["serial_number"],
        "status": warranty.get("status", WarrantyStatus.APPROVED.value),
        "is_valid": True,
        "purchase_date": warranty["purchase_date"],
        "expires_at": "Lifetime Guarantee",
        "registered_at": warranty["registered_at"]
    }


@router.post("/warranty/claim", status_code=status.HTTP_201_CREATED)
async def submit_warranty_claim(payload: WarrantyClaimCreate):
    db = get_database()
    
    # 1. Verify warranty code
    warranty = await db.warranties.find_one({"warranty_code": payload.warranty_code.strip().upper()})
    if not warranty:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Invalid Warranty Code. Please verify your code and try again."
        )
    
    if warranty["email"].lower() != payload.email.lower():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email address does not match the registered warranty record."
        )

    claim_code = generate_code("CLM")
    now = datetime.now(timezone.utc)

    claim_doc = {
        "claim_code": claim_code,
        "warranty_code": warranty["warranty_code"],
        "order_id": warranty["order_id"],
        "customer_name": warranty["customer_name"],
        "email": payload.email,
        "phone": warranty.get("phone"),
        "serial_number": warranty["serial_number"],
        "issue_category": payload.issue_category.value,
        "description": payload.description,
        "evidence_url": payload.evidence_url,
        "status": ClaimStatus.UNDER_REVIEW.value,
        "admin_notes": None,
        "tracking_number": None,
        "submitted_at": now.strftime("%Y-%m-%d %H:%M UTC"),
        "created_timestamp": now.timestamp()
    }

    await db.warranty_claims.insert_one(claim_doc)

    return {
        "success": True,
        "message": "Lifetime Warranty Claim submitted successfully! Our Quality Engineers will review your media evidence within 24 hours.",
        "claim_code": claim_code,
        "status": ClaimStatus.UNDER_REVIEW.value,
        "submitted_at": claim_doc["submitted_at"]
    }


@router.get("/warranty/claim/verify/{claim_code}")
async def verify_claim_status(claim_code: str):
    db = get_database()
    claim = await db.warranty_claims.find_one({"claim_code": claim_code.strip().upper()})
    
    if not claim:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Warranty claim '{claim_code}' not found."
        )

    return {
        "claim_code": claim["claim_code"],
        "warranty_code": claim["warranty_code"],
        "issue_category": claim["issue_category"],
        "status": claim["status"],
        "submitted_at": claim["submitted_at"],
        "admin_notes": claim.get("admin_notes"),
        "tracking_number": claim.get("tracking_number")
    }

# ─── ADMIN WARRANTY ENDPOINTS ─────────────────────────────────────────────────

@router.get("/warranty/admin/registrations")
async def get_all_warranties(status_filter: Optional[str] = Query(None)):
    db = get_database()
    query = {}
    if status_filter:
        query["status"] = status_filter

    cursor = db.warranties.find(query).sort("created_timestamp", -1)
    warranties = []
    async for w in cursor:
        w["_id"] = str(w["_id"])
        warranties.append(w)

    return warranties


@router.get("/warranty/admin/claims")
async def get_all_claims(status_filter: Optional[str] = Query(None)):
    db = get_database()
    query = {}
    if status_filter:
        query["status"] = status_filter

    cursor = db.warranty_claims.find(query).sort("created_timestamp", -1)
    claims = []
    async for c in cursor:
        c["_id"] = str(c["_id"])
        claims.append(c)

    return claims


@router.patch("/warranty/admin/registrations/{warranty_code}")
async def update_warranty_status(warranty_code: str, payload: WarrantyAdminUpdate):
    db = get_database()
    res = await db.warranties.update_one(
        {"warranty_code": warranty_code.strip().upper()},
        {"$set": {"status": payload.status.value, "admin_notes": payload.admin_notes}}
    )
    
    if res.matched_count == 0:
        raise HTTPException(status_code=404, detail="Warranty not found")
        
    return {"success": True, "message": f"Warranty {warranty_code} status updated to {payload.status.value}"}


@router.patch("/warranty/admin/claims/{claim_code}")
async def update_claim_status(claim_code: str, payload: ClaimAdminUpdate):
    db = get_database()
    update_dict = {"status": payload.status.value}
    if payload.admin_notes:
        update_dict["admin_notes"] = payload.admin_notes
    if payload.tracking_number:
        update_dict["tracking_number"] = payload.tracking_number

    res = await db.warranty_claims.update_one(
        {"claim_code": claim_code.strip().upper()},
        {"$set": update_dict}
    )

    if res.matched_count == 0:
        raise HTTPException(status_code=404, detail="Claim not found")

    return {"success": True, "message": f"Claim {claim_code} status updated to {payload.status.value}"}
