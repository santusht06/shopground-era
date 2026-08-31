"""Pydantic models for emails, drafts, and attachments."""
from pydantic import BaseModel, EmailStr
from typing import Optional, List
from datetime import datetime


class EmailAddress(BaseModel):
    name: Optional[str] = None
    address: str


class Attachment(BaseModel):
    id: str
    filename: str
    content_type: str
    size_bytes: int
    url: str


class EmailOut(BaseModel):
    id: str
    message_id: Optional[str] = None
    owner: str          # email address of mailbox owner
    folder: str         # inbox | sent | drafts | trash | spam | archive | custom
    from_address: str
    from_name: Optional[str] = None
    to: List[str]
    cc: List[str] = []
    bcc: List[str] = []
    subject: str
    body_html: Optional[str] = None
    body_text: Optional[str] = None
    attachments: List[Attachment] = []
    read: bool = False
    starred: bool = False
    labels: List[str] = []
    date: datetime
    created_at: datetime

    class Config:
        from_attributes = True


class EmailListItem(BaseModel):
    """Lightweight email for list views (no body)."""
    id: str
    from_address: str
    from_name: Optional[str] = None
    to: List[str]
    subject: str
    preview: str          # first 150 chars of body_text
    read: bool
    starred: bool
    labels: List[str]
    has_attachments: bool
    date: datetime


class ComposeRequest(BaseModel):
    to: List[str]
    cc: List[str] = []
    bcc: List[str] = []
    subject: str
    body_html: str
    body_text: Optional[str] = None
    attachment_ids: List[str] = []
    reply_to_id: Optional[str] = None     # id of email being replied to
    forward_of_id: Optional[str] = None   # id of email being forwarded
    scheduled_at: Optional[datetime] = None  # scheduled send


class DraftSave(BaseModel):
    to: List[str] = []
    cc: List[str] = []
    bcc: List[str] = []
    subject: str = ""
    body_html: str = ""
    attachment_ids: List[str] = []


class MoveRequest(BaseModel):
    email_ids: List[str]
    target_folder: str


class FlagRequest(BaseModel):
    email_ids: List[str]
    read: Optional[bool] = None
    starred: Optional[bool] = None


class SearchRequest(BaseModel):
    query: str
    folder: Optional[str] = None
    from_address: Optional[str] = None
    has_attachments: Optional[bool] = None
    date_from: Optional[datetime] = None
    date_to: Optional[datetime] = None
    limit: int = 50
    offset: int = 0
