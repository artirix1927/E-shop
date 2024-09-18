from email import message
import json
from confluent_kafka import Consumer, KafkaError
from django.conf import settings

import chat.models as db_models

def kafka_consumer():
    # Create Kafka consumer instance
    consumer = Consumer({
        'bootstrap.servers': 'localhost:9092',
        'group.id': 'chat_group',
        'auto.offset.reset': 'earliest'
    })
    
    consumer.subscribe(['chat-topic'])
    
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
        chat_message_data = json.loads(msg.value().decode('utf-8'))

        # Send email using Django's send_mail
        db_models.Message.objects.create(message=chat_message_data['message'], 
                                          ticket_id=chat_message_data['ticket'], 
                                          sent_by_id=chat_message_data['sentBy']['id'])
        
    consumer.close()
    