import os
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
import datetime

RECIPIENT_EMAIL = os.getenv("NOTIFY_EMAIL", "info@shopgroundera.com")

def render_inquiry_email_html(inquiry: dict) -> str:
    """
    Renders an HTML email template for new distributor/customer inquiries.
    Theme: Pitch Black & Vibrant Orange (#F27E24).
    """
    name = inquiry.get("name", "N/A")
    email = inquiry.get("email", "N/A")
    phone = inquiry.get("phone") or "Not Provided"
    company = inquiry.get("company") or "Individual / Retail"
    qty = inquiry.get("target_quantity", 1)
    message = inquiry.get("message", "No custom notes provided.")
    inquiry_id = inquiry.get("id") or inquiry.get("_id", "INQ-UNKNOWN")
    created_at = inquiry.get("created_at") or datetime.datetime.utcnow().strftime("%Y-%m-%d %H:%M UTC")

    return f"""<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>New Product Inquiry — ShopGround Era</title>
</head>
<body style="margin:0; padding:0; background-color:#050507; font-family:-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color:#F8FAFC;">
    <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color:#050507; padding:40px 10px;">
        <tr>
            <td align="center">
                <table width="600" border="0" cellspacing="0" cellpadding="0" style="background-color:#0C0C12; border:1px solid rgba(255,255,255,0.1); border-radius:24px; overflow:hidden; box-shadow:0 20px 50px rgba(0,0,0,0.8);">
                    
                    <!-- Header Bar -->
                    <tr>
                        <td style="background-color:#08080C; padding:30px 40px; border-bottom:1px solid rgba(255,255,255,0.1); text-align:center;">
                            <span style="font-size:10px; font-weight:900; letter-spacing:3px; text-transform:uppercase; color:#F27E24; display:block; margin-bottom:6px;">
                                SHOPGROUND ERA — OFFICIAL LEAD DISPATCH
                            </span>
                            <h1 style="margin:0; font-size:24px; font-weight:900; color:#FFFFFF; tracking-tight:-0.03em;">
                                New Wholesale & Sample Inquiry
                            </h1>
                            <span style="display:inline-block; margin-top:8px; font-family:monospace; font-size:12px; color:#94A3B8; background-color:rgba(255,255,255,0.05); padding:4px 12px; border-radius:99px;">
                                ID: {inquiry_id}
                            </span>
                        </td>
                    </tr>

                    <!-- Body Content -->
                    <tr>
                        <td style="padding:35px 40px;">
                            <p style="margin:0 0 20px 0; font-size:14px; color:#CBD5E1; line-height:1.6;">
                                A new client inquiry has been submitted on <strong>ShopGround Era</strong>. Below are the consolidated request details:
                            </p>

                            <!-- Customer Specs Table -->
                            <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color:#08080D; border:1px solid rgba(255,255,255,0.08); border-radius:16px; margin-bottom:25px; overflow:hidden;">
                                <tr>
                                    <td width="35%" style="padding:14px 18px; border-bottom:1px solid rgba(255,255,255,0.08); font-size:12px; font-weight:700; color:#F27E24; text-transform:uppercase; letter-spacing:1px;">
                                        Client Name
                                    </td>
                                    <td style="padding:14px 18px; border-bottom:1px solid rgba(255,255,255,0.08); font-size:14px; font-weight:700; color:#FFFFFF;">
                                        {name}
                                    </td>
                                </tr>
                                <tr>
                                    <td style="padding:14px 18px; border-bottom:1px solid rgba(255,255,255,0.08); font-size:12px; font-weight:700; color:#F27E24; text-transform:uppercase; letter-spacing:1px;">
                                        Email Address
                                    </td>
                                    <td style="padding:14px 18px; border-bottom:1px solid rgba(255,255,255,0.08); font-size:14px; color:#FFFFFF;">
                                        <a href="mailto:{email}" style="color:#F27E24; text-decoration:none; font-weight:700;">{email}</a>
                                    </td>
                                </tr>
                                <tr>
                                    <td style="padding:14px 18px; border-bottom:1px solid rgba(255,255,255,0.08); font-size:12px; font-weight:700; color:#F27E24; text-transform:uppercase; letter-spacing:1px;">
                                        Phone Number
                                    </td>
                                    <td style="padding:14px 18px; border-bottom:1px solid rgba(255,255,255,0.08); font-size:14px; color:#E2E8F0;">
                                        {phone}
                                    </td>
                                </tr>
                                <tr>
                                    <td style="padding:14px 18px; border-bottom:1px solid rgba(255,255,255,0.08); font-size:12px; font-weight:700; color:#F27E24; text-transform:uppercase; letter-spacing:1px;">
                                        Company / Org
                                    </td>
                                    <td style="padding:14px 18px; border-bottom:1px solid rgba(255,255,255,0.08); font-size:14px; color:#E2E8F0;">
                                        {company}
                                    </td>
                                </tr>
                                <tr>
                                    <td style="padding:14px 18px; font-size:12px; font-weight:700; color:#F27E24; text-transform:uppercase; letter-spacing:1px;">
                                        Target Units
                                    </td>
                                    <td style="padding:14px 18px; font-size:16px; font-weight:900; color:#FFFFFF; font-family:monospace;">
                                        {qty} Units
                                    </td>
                                </tr>
                            </table>

                            <!-- Message Box -->
                            <div style="background-color:#12121B; border:1px solid rgba(242,126,36,0.3); border-radius:16px; padding:20px; margin-bottom:30px;">
                                <span style="font-size:10px; font-weight:900; color:#F27E24; text-transform:uppercase; letter-spacing:1px; display:block; margin-bottom:8px;">
                                    Inquiry Specifications & Notes
                                </span>
                                <p style="margin:0; font-size:13px; color:#F1F5F9; line-height:1.6; white-space:pre-wrap;">
                                    {message}
                                </p>
                            </div>

                            <!-- Direct Action Button -->
                            <table width="100%" border="0" cellspacing="0" cellpadding="0">
                                <tr>
                                    <td align="center">
                                        <a href="mailto:{email}?subject=RE:%20ShopGround%20Era%20Inquiry%20{inquiry_id}" style="display:inline-block; background-color:#F27E24; color:#FFFFFF; font-size:14px; font-weight:800; text-decoration:none; padding:14px 32px; border-radius:12px; box-shadow:0 6px 20px rgba(242,126,36,0.4);">
                                            Reply Directly to Client ({email})
                                        </a>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>

                    <!-- Footer -->
                    <tr>
                        <td style="background-color:#08080C; padding:20px 40px; border-top:1px solid rgba(255,255,255,0.08); text-align:center; font-size:11px; color:#64748B;">
                            <p style="margin:0;">Submitted on {created_at} · Automatically dispatched to <strong>{RECIPIENT_EMAIL}</strong></p>
                        </td>
                    </tr>

                </table>
            </td>
        </tr>
    </table>
</body>
</html>"""

def send_inquiry_email(inquiry: dict):
    """
    Dispatches email via SMTP if configured, or logs the full HTML email template.
    Always targets santushtkotai1221@gmail.com.
    """
    html_content = render_inquiry_email_html(inquiry)
    smtp_host = os.getenv("SMTP_HOST")
    smtp_port = int(os.getenv("SMTP_PORT", 587))
    smtp_user = os.getenv("SMTP_USER")
    smtp_pass = os.getenv("SMTP_PASSWORD")

    print("\n" + "="*70)
    print(f"📧 DISPATCHING INQUIRY EMAIL NOTIFICATION TO: {RECIPIENT_EMAIL}")
    print(f"   Inquiry ID : {inquiry.get('id') or inquiry.get('_id')}")
    print(f"   Client     : {inquiry.get('name')} ({inquiry.get('email')})")
    print(f"   Target Qty : {inquiry.get('target_quantity')} Units")
    print("="*70)

    if smtp_host and smtp_user and smtp_pass:
        try:
            msg = MIMEMultipart("alternative")
            msg["Subject"] = f"🔔 New Lead Inquiry ({inquiry.get('target_quantity')} Units) — {inquiry.get('name')}"
            msg["From"] = smtp_user
            msg["To"] = RECIPIENT_EMAIL
            msg.attach(MIMEText(html_content, "html"))

            with smtplib.SMTP(smtp_host, smtp_port) as server:
                server.starttls()
                server.login(smtp_user, smtp_pass)
                server.sendmail(smtp_user, RECIPIENT_EMAIL, msg.as_string())
            print(f"✅ SMTP Email successfully sent to {RECIPIENT_EMAIL}!")
        except Exception as e:
            print(f"⚠️ SMTP Error (fallback to log mode): {e}")
    else:
        print(f"ℹ️ SMTP environment credentials not set. HTML template rendered successfully for {RECIPIENT_EMAIL}.")

    print("="*70 + "\n")
    return True
