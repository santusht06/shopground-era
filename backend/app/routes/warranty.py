import os
import secrets
from datetime import datetime, timezone, timedelta
from typing import Optional, List
from fastapi import Request, APIRouter, HTTPException, status, UploadFile, File, Form, Query, Header, Depends
from pydantic import BaseModel
from motor.motor_asyncio import AsyncIOMotorDatabase

from app.core.templates import (
    get_warranty_registered_html,
    get_claim_submitted_html,
    get_claim_decision_html
)
from app.core.mail import send_email_async
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

ADMIN_AUTH_KEY = "ShopGroundMail2026!"

async def verify_admin_access(
    x_admin_secret: Optional[str] = Header(None, alias="X-Admin-Secret"),
    authorization: Optional[str] = Header(None)
):
    """Enforce strict admin authorization for warranty management endpoints."""
    token = None
    if x_admin_secret:
        token = x_admin_secret
    elif authorization and authorization.startswith("Bearer "):
        token = authorization.split("Bearer ")[1]
        
    if not token or (token != ADMIN_AUTH_KEY and token != "ShopGroundEra2026Admin!"):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Unauthorized. Valid Admin credentials or Secret Key required."
        )
    return True

MINIO_EVIDENCE_DIR = "/var/lib/minio/data/warranty-evidence"

def generate_code(prefix: str) -> str:
    token = secrets.token_hex(4).upper()
    return f"{prefix}-{token[:4]}-{token[4:]}"

# ─── ADMIN AUTH LOGIN ─────────────────────────────────────────────────────────

class AdminLoginPayload(BaseModel):
    email: Optional[str] = None
    password: str

@router.post("/warranty/admin/auth/login")
async def admin_auth_login(payload: AdminLoginPayload):
    """Verify Master Admin Password before granting administrative access."""
    if payload.password == ADMIN_AUTH_KEY or payload.password == "ShopGroundEra2026Admin!":
        return {
            "success": True,
            "token": ADMIN_AUTH_KEY,
            "role": "admin",
            "message": "Authenticated successfully"
        }
    raise HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Invalid administrator master password."
    )

# ─── EVIDENCE UPLOADS ─────────────────────────────────────────────────────────

@router.post("/warranty/upload-evidence")
async def upload_warranty_evidence(request: Request):
    """Upload defect proof photos/videos to secure evidence storage."""
    try:
        form = await request.form()
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Invalid multipart form data: {str(e)}"
        )

    upload_items: List[UploadFile] = []
    files_list = [it for it in form.getlist("files") if hasattr(it, "filename") and it.filename]
    if files_list:
        upload_items = files_list
    else:
        file_list = [it for it in form.getlist("file") if hasattr(it, "filename") and it.filename]
        if file_list:
            upload_items = file_list
        else:
            for val in form.values():
                if hasattr(val, "filename") and val.filename and val not in upload_items:
                    upload_items.append(val)

    if not upload_items:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="No files received. Please select an image or video to upload."
        )

    allowed_extensions = {".jpg", ".jpeg", ".png", ".webp", ".mp4", ".mov", ".webm"}
    uploaded_urls = []
    uploaded_files = []

    os.makedirs(MINIO_EVIDENCE_DIR, exist_ok=True)

    try:
        for item in upload_items:
            if not item or not item.filename:
                continue
            ext = os.path.splitext(item.filename)[1].lower()
            if ext not in allowed_extensions:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail=f"Unsupported file type '{ext}' for '{item.filename}'. Allowed: Images (JPEG, PNG, WEBP) and Videos (MP4, MOV, WEBM)."
                )

            content = await item.read()
            if len(content) > 100 * 1024 * 1024:
                raise HTTPException(
                    status_code=status.HTTP_413_REQUEST_ENTITY_TOO_LARGE,
                    detail=f"Evidence file '{item.filename}' exceeds 100MB limit."
                )

            unique_filename = f"{secrets.token_hex(8)}{ext}"
            target_path = os.path.join(MINIO_EVIDENCE_DIR, unique_filename)
            with open(target_path, "wb") as f_out:
                f_out.write(content)

            public_url = f"https://shopgroundera.com/minio/warranty-evidence/{unique_filename}"
            uploaded_urls.append(public_url)
            uploaded_files.append({
                "filename": unique_filename,
                "original_filename": item.filename,
                "evidence_url": public_url,
                "size_bytes": len(content),
                "content_type": item.content_type
            })

        if not uploaded_urls:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="No valid files were uploaded."
            )

        return {
            "success": True,
            "evidence_url": uploaded_urls[0],
            "url": uploaded_urls[0],
            "urls": uploaded_urls,
            "files": uploaded_files,
            "count": len(uploaded_urls)
        }
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to store evidence media: {str(e)}"
        )

# ─── PUBLIC WARRANTY ENDPOINTS ────────────────────────────────────────────────

@router.post("/warranty/register", status_code=status.HTTP_201_CREATED)
async def register_warranty(payload: WarrantyRegisterCreate):
    db = get_database()
    
    existing = await db.warranties.find_one({"order_id": payload.order_id.strip()})
    if existing:
        return {
            "success": True,
            "message": "Lifetime Warranty already registered for this Order ID.",
            "warranty_code": existing["warranty_code"],
            "status": existing.get("status", WarrantyStatus.APPROVED.value),
            "expires_at": existing.get("expires_at", "Lifetime Coverage Active")
        }

    now = datetime.now(timezone.utc)
    warranty_code = generate_code("WRN")

    # Safe date conversion
    p_date = str(payload.purchase_date).strip() if payload.purchase_date else now.strftime("%Y-%m-%d")

    doc = {
        "warranty_code": warranty_code,
        "product_name": payload.product_name,
        "order_id": payload.order_id.strip(),
        "customer_name": payload.customer_name.strip(),
        "email": payload.email.strip().lower(),
        "phone": payload.phone.strip() if payload.phone else None,
        "purchase_date": p_date,
        "status": WarrantyStatus.APPROVED.value,
        "expires_at": "Lifetime Coverage Active",
        "registered_at": now.strftime("%Y-%m-%d %H:%M UTC"),
        "created_timestamp": now.timestamp(),
        "admin_notes": None
    }

    await db.warranties.insert_one(doc)

    html_email = get_warranty_registered_html(
        customer_name=payload.customer_name,
        warranty_code=warranty_code,
        order_id=payload.order_id.strip(),
        product_name=payload.product_name,
        purchase_date=p_date
    )
    try:
        await send_email_async(payload.email, f"ShopGround Era™ Lifetime Guarantee Active [{warranty_code}]", html_email)
    except Exception as mail_err:
        print("Warranty register email error:", mail_err)

    return {
        "success": True,
        "message": "Lifetime Warranty registered successfully! Your ShopGround Era™ Lifetime Guarantee is now active.",
        "warranty_code": warranty_code,
        "status": WarrantyStatus.APPROVED.value,
        "expires_at": "Lifetime Coverage Active"
    }


@router.get("/warranty/verify/{warranty_code}")
async def verify_warranty(warranty_code: str):
    db = get_database()
    code_clean = warranty_code.strip().upper()

    claim = await db.warranty_claims.find_one({"claim_code": code_clean})
    if claim:
        warranty = await db.warranties.find_one({"warranty_code": claim["warranty_code"]})
        return {
            "type": "claim",
            "claim_code": claim["claim_code"],
            "warranty_code": claim["warranty_code"],
            "order_id": claim.get("order_id") or (warranty["order_id"] if warranty else "N/A"),
            "customer_name": claim.get("customer_name") or (warranty["customer_name"] if warranty else "N/A"),
            "email": claim.get("email") or (warranty["email"] if warranty else "N/A"),
            "status": claim["status"],
            "issue_category": claim["issue_category"],
            "submitted_at": claim["submitted_at"],
            "admin_notes": claim.get("admin_notes"),
            "tracking_number": claim.get("tracking_number"),
            "evidence_url": claim.get("evidence_url"),
            "evidence_urls": claim.get("evidence_urls", []),
            "product_name": warranty.get("product_name") if warranty else "ShopGround Era Anti-Vibration Pads",
            "serial_number": claim.get("serial_number") or (warranty["serial_number"] if warranty else "N/A")
        }

    warranty = await db.warranties.find_one({"warranty_code": code_clean})
    if not warranty:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"No record found for code '{code_clean}'. Please check your Warranty Code (WRN-...) or Claim Code (CLM-...)."
        )

    claims_cursor = db.warranty_claims.find({"warranty_code": code_clean}).sort("created_timestamp", -1)
    claims = []
    async for c in claims_cursor:
        claims.append({
            "claim_code": c["claim_code"],
            "status": c["status"],
            "issue_category": c["issue_category"],
            "submitted_at": c["submitted_at"],
            "admin_notes": c.get("admin_notes"),
            "tracking_number": c.get("tracking_number")
        })

    return {
        "type": "warranty",
        "warranty_code": warranty["warranty_code"],
        "product_name": warranty["product_name"],
        "customer_name": warranty["customer_name"],
        "serial_number": warranty.get("serial_number"),
        "order_id": warranty["order_id"],
        "purchase_date": warranty["purchase_date"],
        "status": warranty["status"],
        "expires_at": warranty["expires_at"],
        "claims": claims
    }


@router.post("/warranty/claim", status_code=status.HTTP_201_CREATED)
async def submit_warranty_claim(payload: WarrantyClaimCreate):
    db = get_database()
    warranty = await db.warranties.find_one({
        "warranty_code": payload.warranty_code.strip().upper(),
        "email": payload.email.strip().lower()
    })

    if not warranty:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Warranty '{payload.warranty_code}' not found for email '{payload.email}'. Please verify your Warranty Registration Code."
        )

    now = datetime.now(timezone.utc)
    claim_code = generate_code("CLM")

    claim_doc = {
        "claim_code": claim_code,
        "warranty_code": warranty["warranty_code"],
        "order_id": warranty["order_id"],
        "customer_name": warranty["customer_name"],
        "email": payload.email,
        "phone": warranty.get("phone"),
        "serial_number": warranty.get("serial_number"),
        "issue_category": payload.issue_category.value,
        "description": payload.description,
        "evidence_url": payload.evidence_url or (payload.evidence_urls[0] if payload.evidence_urls else None),
        "evidence_urls": payload.evidence_urls or ([payload.evidence_url] if payload.evidence_url else []),
        "status": ClaimStatus.UNDER_REVIEW.value,
        "admin_notes": None,
        "tracking_number": None,
        "submitted_at": now.strftime("%Y-%m-%d %H:%M UTC"),
        "created_timestamp": now.timestamp()
    }

    await db.warranty_claims.insert_one(claim_doc)

    evidence_count = len(claim_doc.get("evidence_urls", []))
    html_claim_email = get_claim_submitted_html(
        customer_name=warranty["customer_name"],
        claim_code=claim_code,
        warranty_code=warranty["warranty_code"],
        issue_category=payload.issue_category.value,
        description=payload.description,
        evidence_count=evidence_count
    )
    try:
        await send_email_async(payload.email, f"ShopGround Era™ Defect Claim Received [{claim_code}]", html_claim_email)
    except Exception as mail_err:
        print("Claim submission email error:", mail_err)

    return {
        "success": True,
        "message": "Lifetime Warranty Claim submitted successfully! Our Quality Engineers will review your media evidence within 24 hours.",
        "claim_code": claim_code,
        "status": ClaimStatus.UNDER_REVIEW.value,
        "submitted_at": claim_doc["submitted_at"]
    }


@router.get("/warranty/claim/{claim_code}")
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

# ─── PROTECTED ADMIN WARRANTY ENDPOINTS ───────────────────────────────────────

@router.get("/warranty/admin/registrations")
async def get_all_warranties(
    status_filter: Optional[str] = Query(None),
    is_admin: bool = Depends(verify_admin_access)
):
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
async def get_all_claims(
    status_filter: Optional[str] = Query(None),
    is_admin: bool = Depends(verify_admin_access)
):
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
async def update_warranty_status(
    warranty_code: str,
    payload: WarrantyAdminUpdate,
    is_admin: bool = Depends(verify_admin_access)
):
    db = get_database()
    res = await db.warranties.update_one(
        {"warranty_code": warranty_code.strip().upper()},
        {"$set": {"status": payload.status.value, "admin_notes": payload.admin_notes}}
    )
    
    if res.matched_count == 0:
        raise HTTPException(status_code=404, detail="Warranty not found")
        
    return {"success": True, "message": f"Warranty {warranty_code} status updated to {payload.status.value}"}


@router.patch("/warranty/admin/claims/{claim_code}")
async def update_claim_status(
    claim_code: str,
    payload: ClaimAdminUpdate,
    is_admin: bool = Depends(verify_admin_access)
):
    db = get_database()
    code_clean = claim_code.strip().upper()
    claim = await db.warranty_claims.find_one({"claim_code": code_clean})
    if not claim:
        raise HTTPException(status_code=404, detail=f"Claim '{code_clean}' not found")

    update_dict = {"status": payload.status.value}
    if payload.admin_notes is not None:
        update_dict["admin_notes"] = payload.admin_notes
    if payload.tracking_number is not None:
        update_dict["tracking_number"] = payload.tracking_number

    await db.warranty_claims.update_one(
        {"claim_code": code_clean},
        {"$set": update_dict}
    )

    # Fetch fresh claim data
    updated_claim = await db.warranty_claims.find_one({"claim_code": code_clean})

    # Dispatch Decision Email to Customer
    customer_email = updated_claim.get("email")
    email_dispatched = False
    
    if customer_email:
        html_decision = get_claim_decision_html(
            customer_name=updated_claim.get("customer_name") or "Valued Customer",
            claim_code=code_clean,
            new_status=payload.status.value,
            admin_notes=payload.admin_notes or updated_claim.get("admin_notes"),
            tracking_number=payload.tracking_number or updated_claim.get("tracking_number")
        )
        try:
            subject = f"ShopGround Era™ Claim Update: {payload.status.value} [{code_clean}]"
            email_dispatched = await send_email_async(
                customer_email,
                subject,
                html_decision
            )
            print(f"✅ Claim update decision email sent to {customer_email} for claim {code_clean}: {email_dispatched}")
        except Exception as mail_err:
            print(f"❌ Claim decision email error for {customer_email}: {mail_err}")

    return {
        "success": True,
        "message": f"Claim {code_clean} status updated to {payload.status.value}",
        "email_notified": customer_email,
        "email_dispatched": email_dispatched
    }
