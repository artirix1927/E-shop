import chat.models as db_models
import json
from common_streaming import get_message_consumer


def consume_chat_message():
    consumer = get_message_consumer()
    print(consumer.__class__)

    def create_chat_message(chat_message_data):
        chat_message_data = json.loads(chat_message_data)

        db_models.Message.objects.create(message=chat_message_data['message'],
                                         ticket_id=chat_message_data['ticket'],
                                         sent_by=chat_message_data['sentBy']['id'])

    consumer.consume('chat-topic', create_chat_message)
