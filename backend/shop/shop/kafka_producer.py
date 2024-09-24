
from confluent_kafka import Producer
from django.conf import settings


def delivery_report(err, msg):
    """ Called once for each message produced to indicate delivery result. """
    if err is not None:
        print(f"Message delivery failed: {err}")
    else:
        print(f"Message delivered to {msg.topic()} [{msg.partition()}]")


def produce_message(topic, message):
    conf = settings.KAFKA_CONFIG
    producer = Producer(conf)

    try:
        producer.produce(topic, message.encode(
            'utf-8'), callback=delivery_report)
        producer.flush()  # Wait for message to be delivered
    except Exception as e:
        print(f"Failed to send message: {str(e)}")
