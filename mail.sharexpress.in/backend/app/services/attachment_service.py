"""Service for storing and retrieving email attachments from MinIO S3."""
import logging
import uuid
import boto3
from botocore.config import Config
from botocore.exceptions import ClientError
from fastapi import UploadFile, HTTPException
from datetime import datetime

from app.config import settings

logger = logging.getLogger(__name__)

# Initialize boto3 S3 client with custom endpoint & timeouts
s3_client = boto3.client(
    "s3",
    endpoint_url=settings.MINIO_ENDPOINT_INTERNAL,
    aws_access_key_id=settings.MINIO_ACCESS_KEY,
    aws_secret_access_key=settings.MINIO_SECRET_KEY,
    region_name=settings.MINIO_REGION,
    config=Config(
        signature_version="s3v4",
        connect_timeout=5,
        read_timeout=30,
        retries={"max_attempts": 3}
    )
)


class AttachmentService:
    @staticmethod
    async def ensure_bucket():
        """Ensure the attachment bucket exists on startup."""
        try:
            s3_client.head_bucket(Bucket=settings.MINIO_BUCKET)
        except ClientError as e:
            error_code = e.response.get("Error", {}).get("Code")
            if error_code == "404" or error_code == "NoSuchBucket":
                logger.info("Bucket '%s' not found. Creating bucket...", settings.MINIO_BUCKET)
                try:
                    s3_client.create_bucket(Bucket=settings.MINIO_BUCKET)
                    logger.info("✅ Bucket '%s' created successfully.", settings.MINIO_BUCKET)
                except ClientError as ce:
                    logger.error("Failed to create bucket '%s': %s", settings.MINIO_BUCKET, ce)
            else:
                logger.error("Error checking bucket '%s': %s", settings.MINIO_BUCKET, e)

    @staticmethod
    async def upload_attachment(db, file: UploadFile, user_email: str) -> dict:
        """Upload attachment to MinIO S3 and return metadata."""
        attachment_id = str(uuid.uuid4())
        filename = file.filename or "unnamed_attachment"
        content_type = file.content_type or "application/octet-stream"

        # Unique storage path in bucket
        storage_key = f"{attachment_id}/{filename}"

        try:
            # Read file content
            file_data = await file.read()
            size_bytes = len(file_data)

            # Enforce size limits
            max_bytes = settings.MAX_ATTACHMENT_SIZE_MB * 1024 * 1024
            if size_bytes > max_bytes:
                raise HTTPException(
                    status_code=400,
                    detail=f"Attachment exceeds maximum limit of {settings.MAX_ATTACHMENT_SIZE_MB}MB"
                )

            # Upload to S3
            s3_client.put_object(
                Bucket=settings.MINIO_BUCKET,
                Key=storage_key,
                Body=file_data,
                ContentType=content_type
            )

            # Downstream download URL served through our FastAPI proxy endpoint
            # e.g., https://api.mail.sharexpress.in/api/v1/mail/attachment/{attachment_id}
            download_url = f"/api/v1/mail/attachment/{attachment_id}"

            # Save metadata to MongoDB
            metadata = {
                "_id": attachment_id,
                "filename": filename,
                "content_type": content_type,
                "size_bytes": size_bytes,
                "storage_key": storage_key,
                "uploaded_by": user_email,
                "created_at": datetime.utcnow()
            }
            await db.attachments.insert_one(metadata)

            logger.info("Uploaded attachment %s to S3 and MongoDB (%s bytes)", storage_key, size_bytes)

            return {
                "id": attachment_id,
                "filename": filename,
                "content_type": content_type,
                "size_bytes": size_bytes,
                "url": download_url,
                "storage_key": storage_key
            }

        except ClientError as e:
            logger.error("S3 upload client error: %s", e)
            raise HTTPException(status_code=500, detail="Failed to upload file to MinIO S3 storage.")
        except Exception as e:
            logger.error("Attachment upload failed: %s", e)
            raise HTTPException(status_code=500, detail=str(e))
        finally:
            await file.seek(0)

    @staticmethod
    async def get_attachment_stream(storage_key: str):
        """Fetch attachment object stream from S3."""
        try:
            response = s3_client.get_object(
                Bucket=settings.MINIO_BUCKET,
                Key=storage_key
            )
            # Yield body stream and contentType
            return response["Body"], response.get("ContentType", "application/octet-stream")
        except ClientError as e:
            error_code = e.response.get("Error", {}).get("Code")
            if error_code == "NoSuchKey":
                raise HTTPException(status_code=404, detail="Attachment file not found in storage.")
            logger.error("S3 fetch error for key %s: %s", storage_key, e)
            raise HTTPException(status_code=500, detail="Failed to retrieve file from S3 storage.")
