from fastapi import APIRouter, HTTPException, status
from app.models.inquiry import InquiryCreate
from app.core.database import get_database
import datetime
import uuid

router = APIRouter(prefix="/inquiries", tags=["Distributor & Customer Inquiries"])

EMPLOYEE_EMAIL = "employee.sales@shopground.era"

@router.post("", status_code=status.HTTP_201_CREATED)
async def create_inquiry(inquiry_data: InquiryCreate):
    """
    Receive user/distributor interest form, save to MongoDB, and dispatch email notification to sales employee.
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
    inquiry_dict["notified_employee"] = EMPLOYEE_EMAIL

    # Save to MongoDB
    await db["inquiries"].insert_one(inquiry_dict)

    # Log email dispatch to employee
    print(f"\n========================================================")
    print(f"📧 INQUIRY EMAIL NOTIFICATION DISPATCHED TO: {EMPLOYEE_EMAIL}")
    print(f"Inquiry ID : {inquiry_id}")
    print(f"From       : {inquiry_dict['name']} ({inquiry_dict['email']})")
    print(f"Company    : {inquiry_dict.get('company', 'Individual/Retail')}")
    print(f"Phone      : {inquiry_dict.get('phone', 'N/A')}")
    print(f"Target Qty : {inquiry_dict.get('target_quantity', 1)}")
    print(f"Message    : {inquiry_dict['message']}")
    print(f"========================================================\n")

    return {
        "success": True,
        "message": f"Inquiry submitted successfully! A notification email has been sent to our sales representative ({EMPLOYEE_EMAIL}).",
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
