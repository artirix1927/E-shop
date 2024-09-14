from django.http import HttpResponse
from .kafka_producer import produce_message

def send_test_message(request):
    produce_message('test-topic', 'Hello, Kafka!')
    return HttpResponse('Message sent to Kafka.')