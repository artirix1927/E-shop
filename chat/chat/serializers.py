from rest_framework import serializers

import chat.models as db_models

from django.contrib.auth.models import User


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'username', 'email')


class SupportTicketSerializer(serializers.ModelSerializer):
    user = UserSerializer(many=False, read_only=True)

    class Meta:
        model = db_models.SupportTicket
        fields = '__all__'


class MessageSerializer(serializers.ModelSerializer):
    ticket = SupportTicketSerializer(many=False, read_only=True)
    sent_by = UserSerializer(many=False, read_only=True)

    class Meta:
        model = db_models.Message
        fields = '__all__'
