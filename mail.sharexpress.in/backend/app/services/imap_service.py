"""IMAPService handles connection and operations on Dovecot mailboxes via IMAP protocol."""
import logging
import imaplib
import email
from typing import List, Dict, Any, Optional
from app.config import settings

logger = logging.getLogger(__name__)

class IMAPService:
    @staticmethod
    def _get_connection(user_email: str, password: str) -> imaplib.IMAP4:
        """Establishes an IMAP connection to Dovecot."""
        try:
            logger.info("Connecting to IMAP server at %s:%d for %s", settings.DOVECOT_HOST, settings.DOVECOT_IMAP_PORT, user_email)
            # Dovecot is running inside Docker, standard connection
            imap = imaplib.IMAP4(host=settings.DOVECOT_HOST, port=settings.DOVECOT_IMAP_PORT)
            imap.login(user_email, password)
            return imap
        except Exception as e:
            logger.exception("Failed to connect or log in to IMAP server: %s", str(e))
            raise

    @classmethod
    def list_folders(cls, user_email: str, password: str) -> List[str]:
        """Lists folders for a mailbox."""
        imap = cls._get_connection(user_email, password)
        try:
            status, folders = imap.list()
            if status != "OK":
                return []
            
            result = []
            for f in folders:
                # Format: (FLAGS) "Delimiter" "Folder Name"
                parts = f.decode("utf-8").split(' "/" ')
                if len(parts) == 2:
                    name = parts[1].strip('"')
                    result.append(name)
            return result
        finally:
            imap.logout()

    @classmethod
    def fetch_emails(cls, user_email: str, password: str, folder: str = "INBOX", limit: int = 50) -> List[Dict[str, Any]]:
        """Fetches raw emails from IMAP folder."""
        imap = cls._get_connection(user_email, password)
        emails_list = []
        try:
            imap.select(folder)
            status, messages = imap.search(None, "ALL")
            if status != "OK" or not messages[0]:
                return []

            mail_ids = messages[0].split()
            # Fetch latest first
            mail_ids = mail_ids[-limit:]
            mail_ids.reverse()

            for mail_id in mail_ids:
                status, data = imap.fetch(mail_id, "(RFC822)")
                if status != "OK":
                    continue
                
                raw_email = data[0][1]
                msg = email.message_from_bytes(raw_email)
                
                # Parse basic fields
                subject = msg.get("Subject", "")
                # Decode subject
                if subject:
                    from email.header import decode_header
                    decoded = decode_header(subject)
                    subject_parts = []
                    for s, encoding in decoded:
                        if isinstance(s, bytes):
                            subject_parts.append(s.decode(encoding or "utf-8", errors="replace"))
                        else:
                            subject_parts.append(s)
                    subject = "".join(subject_parts)

                from_address = msg.get("From", "")
                to_address = msg.get("To", "")
                date_str = msg.get("Date", "")

                body = ""
                if msg.is_multipart():
                    for part in msg.walk():
                        content_type = part.get_content_type()
                        content_disposition = str(part.get("Content-Disposition"))
                        if content_type == "text/plain" and "attachment" not in content_disposition:
                            body = part.get_payload(decode=True).decode("utf-8", errors="replace")
                            break
                else:
                    body = msg.get_payload(decode=True).decode("utf-8", errors="replace")

                emails_list.append({
                    "id": mail_id.decode("utf-8"),
                    "subject": subject,
                    "from_address": from_address,
                    "to": [to_address],
                    "date": date_str,
                    "preview": body[:150],
                    "body_text": body
                })

            return emails_list
        finally:
            imap.logout()
