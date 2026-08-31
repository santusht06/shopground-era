"""FastAPI routes for mail operations."""
from fastapi import APIRouter, Depends, status, Query, HTTPException
from motor.motor_asyncio import AsyncIOMotorDatabase
from typing import List, Optional

from app.core.deps import get_database, get_current_user
from app.models.email import EmailOut, EmailListItem, ComposeRequest, DraftSave, MoveRequest, FlagRequest, SearchRequest
from app.services.mail_service import MailService

router = APIRouter()

@router.get("/folder/{folder_name}", response_model=List[EmailOut])
async def get_folder_emails(
    folder_name: str,
    limit: int = Query(50, ge=1, le=100),
    skip: int = Query(0, ge=0),
    db: AsyncIOMotorDatabase = Depends(get_database),
    current_user: dict = Depends(get_current_user)
):
    """Retrieve emails from a specific folder (inbox, sent, drafts, trash, spam, etc.)"""
    emails = await MailService.get_emails(db, current_user["email"], folder_name, limit, skip)
    return [EmailOut(**e) for e in emails]

@router.get("/detail/{email_id}", response_model=EmailOut)
async def get_email_detail(
    email_id: str,
    db: AsyncIOMotorDatabase = Depends(get_database),
    current_user: dict = Depends(get_current_user)
):
    """Retrieve details of a single email (marks read automatically)."""
    email_doc = await MailService.get_email_by_id(db, email_id, current_user["email"])
    return EmailOut(**email_doc)

@router.post("/compose", response_model=EmailOut, status_code=status.HTTP_201_CREATED)
async def compose_email(
    req: ComposeRequest,
    db: AsyncIOMotorDatabase = Depends(get_database),
    current_user: dict = Depends(get_current_user)
):
    """Send an email immediately (SMTP + Sent box storage)."""
    email_doc = await MailService.send_email_flow(db, current_user["email"], req)
    return EmailOut(**email_doc)

@router.post("/draft", response_model=EmailOut, status_code=status.HTTP_201_CREATED)
async def save_draft(
    draft: DraftSave,
    db: AsyncIOMotorDatabase = Depends(get_database),
    current_user: dict = Depends(get_current_user)
):
    """Save an email draft without sending."""
    draft_doc = await MailService.create_draft(db, current_user["email"], draft)
    return EmailOut(**draft_doc)

@router.post("/move", status_code=status.HTTP_200_OK)
async def move_emails(
    req: MoveRequest,
    db: AsyncIOMotorDatabase = Depends(get_database),
    current_user: dict = Depends(get_current_user)
):
    """Move list of emails to a target folder (e.g. archive, trash)."""
    modified = await MailService.move_emails(db, current_user["email"], req.email_ids, req.target_folder)
    return {"modified_count": modified, "status": "success"}

@router.post("/flag", status_code=status.HTTP_200_OK)
async def flag_emails(
    req: FlagRequest,
    db: AsyncIOMotorDatabase = Depends(get_database),
    current_user: dict = Depends(get_current_user)
):
    """Mark list of emails as read/unread or starred/unstarred."""
    modified = await MailService.flag_emails(
        db, current_user["email"], req.email_ids, read=req.read, starred=req.starred
    )
    return {"modified_count": modified, "status": "success"}

@router.delete("/purge", status_code=status.HTTP_200_OK)
async def purge_emails(
    email_ids: List[str] = Query(...),
    db: AsyncIOMotorDatabase = Depends(get_database),
    current_user: dict = Depends(get_current_user)
):
    """Permanently delete specified emails (bypass Trash)."""
    deleted = await MailService.delete_permanently(db, current_user["email"], email_ids)
    return {"deleted_count": deleted, "status": "success"}


# ─── Attachment Storage Endpoints (MinIO integration) ───────────────────────
from fastapi import UploadFile, File
from fastapi.responses import StreamingResponse
from app.services.attachment_service import AttachmentService

@router.post("/attachment/upload", status_code=status.HTTP_201_CREATED)
async def upload_attachment(
    file: UploadFile = File(...),
    db: AsyncIOMotorDatabase = Depends(get_database),
    current_user: dict = Depends(get_current_user)
):
    """Upload email attachment to S3 storage bucket."""
    return await AttachmentService.upload_attachment(db, file, current_user["email"])

@router.get("/attachment/{attachment_id}")
async def get_attachment(
    attachment_id: str,
    db: AsyncIOMotorDatabase = Depends(get_database),
    current_user: dict = Depends(get_current_user)
):
    """Authenticated endpoint to download attachment from S3."""
    # Find email where attachment belongs to this user to prevent horizontal privilege escalation
    email_doc = await db.emails.find_one({
        "owner": current_user["email"],
        "attachments.id": attachment_id
    })
    
    if not email_doc:
        raise HTTPException(status_code=404, detail="Attachment metadata not found or access denied.")
        
    # Get exact filename and content type
    target_att = next(att for att in email_doc["attachments"] if att["id"] == attachment_id)
    
    stream, content_type = await AttachmentService.get_attachment_stream(target_att["storage_key"])
    
    return StreamingResponse(
        stream,
        media_type=content_type,
        headers={"Content-Disposition": f'attachment; filename="{target_att["filename"]}"'}
    )

