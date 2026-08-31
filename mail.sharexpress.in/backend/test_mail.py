import smtplib
import poplib
import time
from email.mime.text import MIMEText
from email.parser import BytesParser
from email.utils import formatdate

def test_smtp_and_pop3():
    sender = "support@sharexpress.in"
    recipient = "santusht@sharexpress.in"
    subject = "Live Test SMTP/POP3"
    body = "Hello! This is a test email sent to verify SMTP and POP3 connectivity on sharexpress.in."
    
    # 1. Send via SMTP
    print(f"Connecting to SMTP server at 127.0.0.1:25...")
    msg = MIMEText(body)
    msg['Subject'] = subject
    msg['From'] = sender
    msg['To'] = recipient
    msg['Date'] = formatdate(localtime=True)
    
    try:
        with smtplib.SMTP('127.0.0.1', 25) as server:
            print("Sending email...")
            server.sendmail(sender, [recipient], msg.as_string())
            print("Email sent successfully via SMTP!")
    except Exception as e:
        print(f"SMTP Error: {e}")
        return

    # 2. Wait for delivery
    print("Waiting 4 seconds for delivery...")
    time.sleep(4)

    # 3. Retrieve via POP3S
    print(f"Connecting to POP3 SSL server at 127.0.0.1:995...")
    try:
        pop = poplib.POP3_SSL('127.0.0.1', 995)
        print("Sending user...")
        pop.user(recipient)
        print("Sending password...")
        pop.pass_("Admin@ShareX2024!")
        
        num_msgs, total_size = pop.stat()
        print(f"Connected! Total messages: {num_msgs}, Total size: {total_size} bytes")
        
        if num_msgs > 0:
            print("Retrieving the latest message...")
            # Retrieve the last message
            resp, lines, octets = pop.retr(num_msgs)
            msg_bytes = b"\n".join(lines)
            parser = BytesParser()
            email_msg = parser.parsebytes(msg_bytes)
            
            print("=== Email Retrieved ===")
            print(f"From: {email_msg['From']}")
            print(f"To: {email_msg['To']}")
            print(f"Subject: {email_msg['Subject']}")
            print(f"Body: {email_msg.get_payload()}")
            print("=======================")
        else:
            print("No emails found in inbox!")
            
        pop.quit()
        print("POP3 connection closed.")
    except Exception as e:
        print(f"POP3 Error: {e}")

if __name__ == "__main__":
    test_smtp_and_pop3()
