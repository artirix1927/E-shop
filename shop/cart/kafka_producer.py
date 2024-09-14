import json
from confluent_kafka import Producer

from django.conf import settings

# Create a Kafka producer instance
producer = Producer(**settings.KAFKA_CONFIG)

def send_email_to_kafka(email_data):
    """
    Push email data to the Kafka topic.
    """
    # Serialize email data to JSON
    email_message = json.dumps(email_data)
    
    # Send to Kafka topic
    producer.produce('email_topic', email_message)
    
    # Flush to make sure it's sent
    producer.flush()