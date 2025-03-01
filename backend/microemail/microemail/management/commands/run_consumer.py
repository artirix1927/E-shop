
from django.core.management.base import BaseCommand

from streaming_logic.consume import consume_email


class Command(BaseCommand):
    help = "Run the Kafka consumer to listen for email messages and send them"

    def handle(self, *args, **options):
        self.stdout.write(self.style.SUCCESS('Starting Kafka consumer...'))
        consume_email()
        self.stdout.write(self.style.SUCCESS('Kafka consumer stopped'))
