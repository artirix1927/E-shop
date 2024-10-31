import json
import time
from confluent_kafka import Producer, KafkaException

from django.conf import settings

producer = None

# Create a Kafka producer instance


def send_email_to_kafka(email_data):
    """
    Push email data to the Kafka topic. If Kafka is unavailable, 
    handle the error gracefully and continue without sending the message.
    """
    global producer

    if producer is None:
        # Initialize the producer if it's not already initialized
        producer = get_kafka_producer()

    # If producer is still None, Kafka connection failed, so skip sending
    if producer:
        # Serialize email data to JSON
        email_message = json.dumps(email_data)

        # Send to Kafka topic
        producer.produce('email-topic', email_message)

        # Flush to make sure it's sent
        producer.poll(0)


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
