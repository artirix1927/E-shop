
import json

from common_streaming import get_message_producer


def send_email_to_streaming(email_data):

    producer = get_message_producer()

    email_message = json.dumps(email_data)

    if producer:
        producer.produce('email-topic', email_message)
