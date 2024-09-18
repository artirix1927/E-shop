import json
from confluent_kafka import Producer

from django.conf import settings

# Create a Kafka producer instance
producer = Producer(**settings.KAFKA_CONFIG)

def send_chat_message_to_kafka(chat_message):
    """
    Push email data to the Kafka topic.
    """
    # Serialize email data to JSON
    msg = json.dumps(chat_message)
    # Send to Kafka topic
    producer.produce('chat-topic', msg)
    
    # Flush to make sure it's sent
    producer.flush()