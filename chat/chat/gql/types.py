
from graphene_django import DjangoObjectType
from chat.models import SupportTicket, Message

from django.contrib.auth.models import User


class SupportTicketType(DjangoObjectType):
    class Meta:
        model = SupportTicket
        fields = '__all__'


class MessageType(DjangoObjectType):
    class Meta:
        model = Message
        fields = '__all__'
        
class UserType(DjangoObjectType):
    class Meta:
        model = User
        fields = '__all__'
