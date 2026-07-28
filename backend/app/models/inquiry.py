from pydantic import BaseModel, EmailStr, Field
from typing import Optional
from datetime import datetime

class InquiryCreate(BaseModel):
    name: str = Field(..., example="Jane Doe")
    email: EmailStr = Field(..., example="jane@company.com")
    phone: Optional[str] = Field(None, example="+1 (555) 019-2834")
    company: Optional[str] = Field(None, example="Acme Retail Solutions")
    target_quantity: Optional[int] = Field(1, example=50)
    message: str = Field(..., example="We are interested in distributing Apex Pro in North America.")
    product_id: Optional[str] = Field("66a87f12bc09a123456789ab", example="66a87f12bc09a123456789ab")

class InquiryInDB(InquiryCreate):
    id: str
    status: str = "Pending"
    created_at: datetime = Field(default_factory=datetime.utcnow)
    notified_employee: str = "employee.sales@shopground.era"
