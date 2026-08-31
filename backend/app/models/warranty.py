from enum import Enum
from typing import Optional
from pydantic import BaseModel, Field, EmailStr

class WarrantyStatus(str, Enum):
    PENDING = "Pending"
    APPROVED = "Lifetime Active"
    EXPIRED = "Expired"
    REJECTED = "Rejected"

class ClaimStatus(str, Enum):
    UNDER_REVIEW = "Under Review"
    APPROVED_REPLACEMENT = "Approved (Replacement)"
    APPROVED_REFUND = "Approved (Refund)"
    REJECTED = "Rejected"
    RESOLVED = "Resolved"

class IssueCategory(str, Enum):
    VIBRATION_DAMPENING_FAIL = "Dampening Failure / Walking Pads"
    MATERIAL_TEAR = "Material Cracking / Tearing"
    LEVELING_SHIM_DEFECT = "Shim / Leveling Component Defect"
    INCORRECT_DIMENSION = "Fitment / Dimension Issue"
    OTHER = "Other Performance Issue"

class WarrantyRegisterCreate(BaseModel):
    order_id: str = Field(..., example="ORD-99824102")
    product_name: str = Field("GroundEra Anti-Vibration Pads", example="GroundEra Anti-Vibration Pads")
    customer_name: str = Field(..., example="Lorem Customer")
    email: EmailStr = Field(..., example="customer@shopground.era")
    phone: Optional[str] = Field(None, example="+1 (555) 234-5678")
    serial_number: str = Field(..., example="GE-2026-98124")
    purchase_date: str = Field(..., example="2026-08-15")
    duration_months: int = Field(1200, example=1200)  # Lifetime Guarantee (100 Years)
    invoice_url: Optional[str] = Field(None, example="https://res.cloudinary.com/demo/invoice.pdf")

class WarrantyClaimCreate(BaseModel):
    warranty_code: str = Field(..., example="WRN-A892F10A")
    email: EmailStr = Field(..., example="customer@shopground.era")
    issue_category: IssueCategory = IssueCategory.VIBRATION_DAMPENING_FAIL
    description: str = Field(..., example="The pads began sliding after 2 weeks of heavy washer spin cycles.")
    evidence_url: Optional[str] = Field(None, example="https://shopgroundera.com/minio/warranty-evidence/file.jpg")

class WarrantyAdminUpdate(BaseModel):
    status: WarrantyStatus
    admin_notes: Optional[str] = None

class ClaimAdminUpdate(BaseModel):
    status: ClaimStatus
    admin_notes: Optional[str] = None
    tracking_number: Optional[str] = None
