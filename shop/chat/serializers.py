from rest_framework import serializers
from .models import Message, SupportTicket

from django.contrib.auth.models import User


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'username','email')


class SupportTicketSerializer(serializers.ModelSerializer):
    user = UserSerializer(many=False,read_only=True)
    class Meta:
        model = SupportTicket
        fields = '__all__'


class MessageSerializer(serializers.ModelSerializer):
    ticket = SupportTicketSerializer(many=False,read_only=True)
    sent_by =  UserSerializer(many=False,read_only=True)
    class Meta:
        model = Message
        fields = '__all__'


