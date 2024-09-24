import email
import json
from confluent_kafka import Consumer, KafkaError
from django.conf import settings
from django.core.mail import send_mail


def kafka_consumer():
    # Create Kafka consumer instance
    consumer = Consumer({
        'bootstrap.servers': 'kafka:9092',
        'group.id': 'email_group',
        'auto.offset.reset': 'earliest'
    })

    consumer.subscribe(['email-topic'])

    while True:
        msg = consumer.poll(1.0)
        if msg is None:
            continue

        if msg.error():
            if msg.error().code() == KafkaError._PARTITION_EOF:
                continue
            else:
                print(msg.error())
                break

        # Parse the message from Kafka
        email_data = json.loads(msg.value().decode('utf-8'))

        # Send email using Django's send_mail

        print(email_data)
        send_mail(

            email_data['subject'],
            email_data['message'],
            email_data['email_from'],
            email_data['recipient_list'],
            fail_silently=False,



        )

    consumer.close()
