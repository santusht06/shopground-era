from fastapi import APIRouter, HTTPException, status
from app.models.inquiry import InquiryCreate
from app.core.database import get_database
from app.services.email_service import send_inquiry_email, RECIPIENT_EMAIL
import datetime
import uuid

router = APIRouter(prefix="/inquiries", tags=["Distributor & Customer Inquiries"])

@router.post("", status_code=status.HTTP_201_CREATED)
async def create_inquiry(inquiry_data: InquiryCreate):
    """
    Receive user/distributor interest form, save to MongoDB, and dispatch HTML email template notification to santushtkotai1221@gmail.com.
    """
    db = get_database()
    if db is None:
        raise HTTPException(status_code=503, detail="Database unavailable")

    inquiry_dict = inquiry_data.dict()
    inquiry_id = f"inq_{uuid.uuid4().hex[:8]}"
    
    inquiry_dict["_id"] = inquiry_id
    inquiry_dict["id"] = inquiry_id
    inquiry_dict["status"] = "Submitted"
    inquiry_dict["created_at"] = datetime.datetime.utcnow().isoformat()
    inquiry_dict["notified_employee"] = RECIPIENT_EMAIL

    # Save to MongoDB database
    await db["inquiries"].insert_one(inquiry_dict)

    # Render & Dispatch HTML Email Template
    send_inquiry_email(inquiry_dict)

    return {
        "success": True,
        "message": f"Inquiry submitted successfully! A notification email has been dispatched to {RECIPIENT_EMAIL}.",
        "inquiry_id": inquiry_id,
        "details": inquiry_dict
    }

@router.get("")
async def list_inquiries():
    """Retrieve all submitted inquiries (for internal/admin usage)."""
    db = get_database()
    if db is None:
        raise HTTPException(status_code=503, detail="Database unavailable")

    cursor = db["inquiries"].find({})
    inquiries = await cursor.to_list(length=100)
    for inq in inquiries:
        inq["_id"] = str(inq["_id"])
    return inquiries
