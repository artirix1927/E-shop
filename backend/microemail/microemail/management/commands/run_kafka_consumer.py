
from django.core.management.base import BaseCommand

from microemail.kafka_consumer import kafka_consumer

class Command(BaseCommand):
    help = "Run the Kafka consumer to listen for email messages and send them"

    def handle(self, *args, **options):
        self.stdout.write(self.style.SUCCESS('Starting Kafka consumer...'))
        kafka_consumer()
        self.stdout.write(self.style.SUCCESS('Kafka consumer stopped'))
