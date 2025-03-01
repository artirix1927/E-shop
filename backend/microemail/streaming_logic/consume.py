import email
import json
from common_streaming import get_message_consumer
from django.core.mail import send_mail


def consume_email():
    consumer = get_message_consumer()

    def send_email(email_data):
        email_data = json.loads(email_data)

        # Send email using Django's send_mail
        send_mail(
            email_data['subject'],
            email_data['message'],
            email_data['email_from'],
            email_data['recipient_list'],
            fail_silently=False,
        )

    consumer.consume('email-topic', send_email)
