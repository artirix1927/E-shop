
import json
from common_streaming import get_message_producer


def send_chat_message_to_streaming(chat_message):
    """
    Push email data to the selected streaming.
    """
    producer = get_message_producer()

    # Serialize email data to JSON
    msg = json.dumps(chat_message)

    if producer:
        producer.produce('chat-topic', msg)
