
from confluent_kafka import Consumer, KafkaError, KafkaException
from django.conf import settings


def consume_messages(topic):
    conf = {
        **settings.KAFKA_CONFIG,
        'group.id': 'my-consumer-group',
        'auto.offset.reset': 'earliest'
    }

    consumer = Consumer(conf)
    consumer.subscribe([topic])

    try:
        while True:
            msg = consumer.poll(1.0)
            if msg is None:
                continue
            if msg.error():
                if msg.error().code() == KafkaError._PARTITION_EOF:
                    continue  # End of partition event
                else:
                    raise KafkaException(msg.error())
            print(f"Consumed message: {msg.value().decode('utf-8')}")
    except Exception as e:
        print(f"Error in Kafka consumer: {str(e)}")
    finally:
        consumer.close()
