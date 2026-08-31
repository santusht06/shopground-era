"""
SMTPService — RFC 5321/5322 compliant outbound email sender.
Every email includes:
  - Message-ID (unique, globally addressable)
  - Date (RFC 2822 format)
  - From with display name
  - List-Unsubscribe (for transactional/bulk emails)
  - Proper MIME structure
  - DKIM will be applied by OpenDKIM milter on Postfix
"""
import uuid
import logging
import asyncio
from datetime import datetime, timezone
from email.utils import formatdate, make_msgid
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
from email.mime.application import MIMEApplication
import bleach
import aiosmtplib

from app.config import settings

logger = logging.getLogger(__name__)

DISPLAY_NAME = "ShareXpress"
DOMAIN = settings.MAIL_DOMAIN


class SMTPService:
    """
    Handles all outbound SMTP delivery to the local Postfix gateway.
    Postfix + OpenDKIM milter handles actual DKIM signing and delivery.
    """

    @staticmethod
    def _build_message(
        from_address: str,
        to_addresses: list[str],
        subject: str,
        body_html: str,
        body_text: str | None = None,
        cc: list[str] | None = None,
        bcc: list[str] | None = None,
        attachments: list[dict] | None = None,
        reply_to: str | None = None,
    ) -> MIMEMultipart:
        """
        Construct a fully RFC 5322-compliant MIME email message.
        
        Returns a MIMEMultipart object ready to send via SMTP.
        """
        cc = cc or []
        bcc = bcc or []
        attachments = attachments or []

        # ─── Determine if we have attachments (mixed) or just body (alternative) ──
        if attachments:
            msg = MIMEMultipart("mixed")
            body_wrapper = MIMEMultipart("alternative")
        else:
            msg = MIMEMultipart("alternative")
            body_wrapper = msg

        # ─── RFC 5322 Required Headers ────────────────────────────────────────────
        # Message-ID: globally unique, never repeat
        msg["Message-ID"] = make_msgid(domain=DOMAIN)
        
        # Date: RFC 2822 format, current UTC timestamp
        msg["Date"] = formatdate(localtime=False, usegmt=True)
        
        # From: Must include display name for better deliverability
        local_part = from_address.split("@")[0]
        display = _get_display_name(local_part)
        msg["From"] = f"{display} <{from_address}>"
        
        # To/Cc
        msg["To"] = ", ".join(to_addresses)
        if cc:
            msg["Cc"] = ", ".join(cc)

        # Subject
        msg["Subject"] = subject

        # MIME version (required)
        msg["MIME-Version"] = "1.0"

        # ─── Recommended Anti-Spam Headers ───────────────────────────────────────
        # Reply-To
        if reply_to:
            msg["Reply-To"] = reply_to

        # X-Mailer: identify the sending software
        msg["X-Mailer"] = f"ShareXpress Enterprise Mail v1.0"

        # List-Unsubscribe: improves deliverability for bulk/transactional email
        # Google/Yahoo require this for bulk senders (>5000/day)
        msg["List-Unsubscribe"] = f"<mailto:unsubscribe@{DOMAIN}?subject=unsubscribe>"
        msg["List-Unsubscribe-Post"] = "List-Unsubscribe=One-Click"

        # Feedback loop header (used by email providers to report spam)
        msg["Feedback-ID"] = f"shareXpress:{local_part}:{DOMAIN}"

        # Precedence: bulk tells receiving servers this is automated
        # (reduces bounce penalties for bulk sends)
        msg["Precedence"] = "bulk"

        # ─── Email Body ───────────────────────────────────────────────────────────
        # Plain text version (always include — required for spam filters)
        if body_text:
            plain_text = body_text
        else:
            # Strip HTML tags to generate plain text fallback
            plain_text = bleach.clean(body_html, tags=[], strip=True).strip()

        body_wrapper.attach(MIMEText(plain_text, "plain", "utf-8"))
        body_wrapper.attach(MIMEText(body_html, "html", "utf-8"))

        # Attach body to mixed if we have attachments
        if attachments:
            msg.attach(body_wrapper)

            for att in attachments:
                part = MIMEApplication(att["data"])
                part.add_header("Content-Disposition", "attachment", filename=att["filename"])
                part.add_header("Content-Type", att.get("content_type", "application/octet-stream"))
                msg.attach(part)

        return msg

    @classmethod
    async def send_email(
        cls,
        from_address: str,
        to_addresses: list[str],
        subject: str,
        body_html: str,
        body_text: str | None = None,
        cc: list[str] | None = None,
        bcc: list[str] | None = None,
        attachments: list[dict] | None = None,
        reply_to: str | None = None,
        max_retries: int = 3,
    ) -> bool:
        """
        Send an email via the local Postfix SMTP gateway.
        
        Returns True on success, False on permanent failure.
        Implements exponential backoff retries.
        """
        cc = cc or []
        bcc = bcc or []

        # All actual recipients (To + Cc + Bcc)
        all_recipients = list(set(to_addresses + cc + bcc))

        if not all_recipients:
            logger.error("No recipients specified for email '%s'", subject)
            return False

        msg = cls._build_message(
            from_address=from_address,
            to_addresses=to_addresses,
            subject=subject,
            body_html=body_html,
            body_text=body_text,
            cc=cc,
            bcc=bcc,
            attachments=attachments,
            reply_to=reply_to,
        )

        for attempt in range(1, max_retries + 1):
            try:
                logger.info(
                    "[SMTP] Attempt %d/%d — Sending '%s' from %s to %s",
                    attempt, max_retries, subject, from_address, all_recipients
                )

                smtp = aiosmtplib.SMTP(
                    hostname=settings.POSTFIX_HOST,
                    port=settings.POSTFIX_PORT,
                    timeout=30,
                )
                await smtp.connect()
                await smtp.send_message(
                    msg,
                    sender=from_address,
                    recipients=all_recipients,
                )
                await smtp.quit()

                logger.info(
                    "[SMTP] ✅ Email '%s' delivered to Postfix for %s",
                    subject, all_recipients
                )
                return True

            except aiosmtplib.SMTPRecipientsRefused as e:
                # Permanent failure — recipient rejected
                logger.error("[SMTP] ❌ Permanent failure (recipients refused): %s — %s", subject, e)
                return False

            except aiosmtplib.SMTPConnectError as e:
                # Postfix not reachable
                wait = 2 ** attempt
                logger.warning("[SMTP] ⚠️ Connection error (attempt %d): %s. Retrying in %ds...", attempt, e, wait)
                await asyncio.sleep(wait)

            except Exception as e:
                wait = 2 ** attempt
                logger.error("[SMTP] ⚠️ Unexpected error (attempt %d): %s. Retrying in %ds...", attempt, e, wait)
                await asyncio.sleep(wait)

        logger.error("[SMTP] ❌ All %d attempts exhausted for '%s'. Email NOT delivered.", max_retries, subject)
        return False

    @staticmethod
    async def send_system_email(to: str, subject: str, body_html: str) -> bool:
        """
        Convenience helper for system-generated emails (welcome, password reset).
        Always sent from noreply@sharexpress.in.
        """
        return await SMTPService.send_email(
            from_address=f"noreply@{DOMAIN}",
            to_addresses=[to],
            subject=subject,
            body_html=body_html,
        )


def _get_display_name(local_part: str) -> str:
    """Map local email parts to friendly display names."""
    DISPLAY_NAMES = {
        "noreply": "ShareXpress",
        "support": "ShareXpress Support",
        "hr": "ShareXpress HR",
        "santusht": "Santusht Kotai",
        "admin": "ShareXpress Admin",
        "hello": "ShareXpress",
    }
    return DISPLAY_NAMES.get(local_part.lower(), "ShareXpress")
