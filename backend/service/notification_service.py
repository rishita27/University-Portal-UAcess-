import os
import smtplib
import ssl
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart


def send_notification(plain_text, html_text, receiver_email):
    sender_email = os.getenv('NOTIFICATION_SENDER_EMAIL')
    sender_password = os.getenv('NOTIFICATION_SENDER_PASSWORD')
    message = MIMEMultipart("alternative")
    message["Subject"] = "UAccess Notification"
    message["From"] = sender_email
    message["To"] = receiver_email

    message.attach(MIMEText(plain_text, "plain"))
    message.attach(MIMEText(html_text, "html"))

    context = ssl.create_default_context()

    with smtplib.SMTP_SSL("smtp.gmail.com", 465, context=context) as server:
        server.login(sender_email, sender_password)
        server.sendmail(sender_email, receiver_email, message.as_string())
