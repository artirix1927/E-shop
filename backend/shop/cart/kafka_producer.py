import json
from confluent_kafka import Producer

from django.conf import settings

producer = None

# Create a Kafka producer instance


def send_email_to_kafka(email_data):
    """
    Push email data to the Kafka topic.
    """
    if not producer:
        get_kafka_producer()

    # Serialize email data to JSON
    email_message = json.dumps(email_data)

    # Send to Kafka topic
    producer.produce('email-topic', email_message)

    # Flush to make sure it's sent
    producer.flush()


def get_kafka_producer():
    global producer
    if producer is None:
        try:
            producer = producer = Producer(**settings.KAFKA_CONFIG)
        except Exception as e:
            # Log the error and handle it accordingly
            print(f"Error connecting to Kafka: {e}")
    return producer
