import json
from confluent_kafka import Producer

from django.conf import settings

# Create a Kafka producer instance

producer = None


def send_chat_message_to_kafka(chat_message):
    """
    Push email data to the Kafka topic.
    """
    producer = get_kafka_producer()

    # Serialize email data to JSON
    msg = json.dumps(chat_message)

    try:
        producer.produce('chat-topic', msg)
        producer.poll()  # Wait for message to be delivered
    except Exception as e:
        print(f"Failed to send message: {str(e)}")


def get_kafka_producer():
    """
    Create Kafka producer with a timeout to avoid indefinite hanging if Kafka is unreachable.
    """
    global producer

    if producer is None:
        try:
            producer = Producer(**settings.KAFKA_CONFIG)
        except Exception as e:
            print(f"Error connecting to Kafka: {e}")
            producer = None

    return producer
