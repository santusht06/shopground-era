import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
import asyncio
from app.core.config import settings

def send_email_sync(to_email: str, subject: str, html_content: str):
    try:
        msg = MIMEMultipart("alternative")
        msg["Subject"] = subject
        msg["From"] = f"{settings.SMTP_FROM_NAME} <{settings.SMTP_FROM_EMAIL}>"
        msg["To"] = to_email

        part = MIMEText(html_content, "html")
        msg.attach(part)

        with smtplib.SMTP(settings.SMTP_HOST, settings.SMTP_PORT, timeout=10) as server:
            if settings.SMTP_USER and settings.SMTP_PASSWORD and settings.SMTP_PORT != 25:
                server.login(settings.SMTP_USER, settings.SMTP_PASSWORD)
            server.sendmail(settings.SMTP_FROM_EMAIL, [to_email], msg.as_string())
        print(f"Successfully sent email to {to_email}: '{subject}'")
        return True
    except Exception as e:
        print(f"Failed to send email to {to_email}: {e}")
        return False

async def send_email_async(to_email: str, subject: str, html_content: str):
    loop = asyncio.get_event_loop()
    return await loop.run_in_executor(None, send_email_sync, to_email, subject, html_content)
