"""MailService handles database storage, folder moves, drafts, and indexing of emails."""
import logging
from datetime import datetime, timezone
from typing import List, Optional, Dict, Any
from bson import ObjectId
from motor.motor_asyncio import AsyncIOMotorDatabase
from fastapi import HTTPException, status

from app.models.email import EmailOut, EmailListItem, ComposeRequest, DraftSave
from app.services.smtp_service import SMTPService

logger = logging.getLogger(__name__)

class MailService:
    @staticmethod
    async def get_emails(
        db: AsyncIOMotorDatabase,
        owner: str,
        folder: str,
        limit: int = 50,
        skip: int = 0
    ) -> List[Dict[str, Any]]:
        """List emails in a folder for a user."""
        cursor = db.emails.find({"owner": owner, "folder": folder}) \
            .sort("date", -1) \
            .skip(skip) \
            .limit(limit)
        
        emails = []
        async for doc in cursor:
            doc["id"] = str(doc["_id"])
            emails.append(doc)
        return emails

    @staticmethod
    async def get_email_by_id(db: AsyncIOMotorDatabase, email_id: str, owner: str) -> Dict[str, Any]:
        """Fetch full email detail and mark it as read."""
        email = await db.emails.find_one({"_id": ObjectId(email_id), "owner": owner})
        if not email:
            raise HTTPException(status_code=404, detail="Email not found")
        
        if not email.get("read", False):
            await db.emails.update_one(
                {"_id": ObjectId(email_id)},
                {"$set": {"read": True}}
            )
            email["read"] = True
            
        email["id"] = str(email["_id"])
        return email

    @staticmethod
    async def _resolve_attachments(db: AsyncIOMotorDatabase, attachment_ids: List[str], owner: str) -> List[Dict[str, Any]]:
        """Resolve a list of attachment IDs to complete metadata dicts."""
        if not attachment_ids:
            return []
        
        cursor = db.attachments.find({"_id": {"$in": attachment_ids}, "uploaded_by": owner})
        attachments = []
        async for doc in cursor:
            attachments.append({
                "id": doc["_id"],
                "filename": doc["filename"],
                "content_type": doc["content_type"],
                "size_bytes": doc["size_bytes"],
                "url": f"/api/v1/mail/attachment/{doc['_id']}",
                "storage_key": doc["storage_key"]
            })
        return attachments

    @staticmethod
    async def create_draft(db: AsyncIOMotorDatabase, owner: str, draft_data: DraftSave) -> Dict[str, Any]:
        """Create or update a draft email."""
        now = datetime.now(timezone.utc)
        resolved_attachments = await MailService._resolve_attachments(db, draft_data.attachment_ids, owner)
        
        draft_doc = {
            "owner": owner,
            "folder": "drafts",
            "from_address": owner,
            "to": draft_data.to,
            "cc": draft_data.cc,
            "bcc": draft_data.bcc,
            "subject": draft_data.subject,
            "body_html": draft_data.body_html,
            "body_text": draft_data.subject,  # fallback plain text representation
            "read": True,
            "starred": False,
            "labels": [],
            "date": now,
            "created_at": now,
            "attachments": resolved_attachments,
            "has_attachments": len(resolved_attachments) > 0
        }
        res = await db.emails.insert_one(draft_doc)
        draft_doc["id"] = str(res.inserted_id)
        return draft_doc

    @staticmethod
    async def send_email_flow(db: AsyncIOMotorDatabase, owner: str, req: ComposeRequest) -> Dict[str, Any]:
        """Triggered from composer. Sends email via SMTP and stores in Sent folder."""
        now = datetime.now(timezone.utc)
        
        # Resolve attachments metadata
        resolved_attachments = await MailService._resolve_attachments(db, req.attachment_ids, owner)
        
        # Fetch attachment binaries from MinIO for outgoing SMTP mime compile
        smtp_attachments = []
        if resolved_attachments:
            from app.services.attachment_service import AttachmentService
            for att in resolved_attachments:
                try:
                    body_stream, content_type = await AttachmentService.get_attachment_stream(att["storage_key"])
                    file_bytes = body_stream.read()  # blocking read of stream data bytes
                    smtp_attachments.append({
                        "filename": att["filename"],
                        "content_type": content_type,
                        "data": file_bytes
                    })
                except Exception as e:
                    logger.error("Failed to fetch S3 attachment body for sending: %s", e)
                    raise HTTPException(
                        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                        detail=f"Failed to fetch S3 attachment '{att['filename']}' for email transmission."
                    )

        # Send via SMTP
        sent_success = await SMTPService.send_email(
            from_address=owner,
            to_addresses=req.to,
            subject=req.subject,
            body_html=req.body_html,
            body_text=req.body_text,
            cc=req.cc,
            bcc=req.bcc,
            attachments=smtp_attachments
        )

        if not sent_success:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Failed to send email through outgoing SMTP server"
            )

        # Store in 'sent' folder
        email_doc = {
            "owner": owner,
            "folder": "sent",
            "from_address": owner,
            "to": req.to,
            "cc": req.cc,
            "bcc": req.bcc,
            "subject": req.subject,
            "body_html": req.body_html,
            "body_text": req.body_text or req.subject,
            "read": True,
            "starred": False,
            "labels": [],
            "date": now,
            "created_at": now,
            "attachments": resolved_attachments,
            "has_attachments": len(resolved_attachments) > 0
        }
        
        res = await db.emails.insert_one(email_doc)
        email_doc["id"] = str(res.inserted_id)
        return email_doc

    @staticmethod
    async def move_emails(db: AsyncIOMotorDatabase, owner: str, email_ids: List[str], target_folder: str) -> int:
        """Move multiple emails to another folder (e.g. trash, archive)."""
        object_ids = [ObjectId(eid) for eid in email_ids]
        res = await db.emails.update_many(
            {"_id": {"$in": object_ids}, "owner": owner},
            {"$set": {"folder": target_folder}}
        )
        return res.modified_count

    @staticmethod
    async def flag_emails(
        db: AsyncIOMotorDatabase,
        owner: str,
        email_ids: List[str],
        read: Optional[bool] = None,
        starred: Optional[bool] = None
    ) -> int:
        """Batch set read/unread or starred/unstarred flags."""
        update_fields = {}
        if read is not None:
            update_fields["read"] = read
        if starred is not None:
            update_fields["starred"] = starred

        if not update_fields:
            return 0

        object_ids = [ObjectId(eid) for eid in email_ids]
        res = await db.emails.update_many(
            {"_id": {"$in": object_ids}, "owner": owner},
            {"$set": update_fields}
        )
        return res.modified_count

    @staticmethod
    async def delete_permanently(db: AsyncIOMotorDatabase, owner: str, email_ids: List[str]) -> int:
        """Permanently delete emails."""
        object_ids = [ObjectId(eid) for eid in email_ids]
        res = await db.emails.delete_many(
            {"_id": {"$in": object_ids}, "owner": owner}
        )
        return res.deleted_count
