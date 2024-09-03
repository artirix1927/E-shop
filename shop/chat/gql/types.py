
from graphene_django import DjangoObjectType
from ..models import SupportTicket, Message


class SupportTicketType(DjangoObjectType):
    class Meta:
        model = SupportTicket
        fields = '__all__'


class MessageType(DjangoObjectType):
    class Meta:
        model = Message
        fields = '__all__'
