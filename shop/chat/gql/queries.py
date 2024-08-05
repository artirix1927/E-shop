from django.db import close_old_connections
import graphene

from django.contrib.auth.models import User
from urllib3 import Retry
from chat.gql.types import SupportTicketType, MessageType


from chat.models import SupportTicket,Message


class SupportTicketQueries(graphene.ObjectType):
    all_tickets = graphene.List(SupportTicketType, offset=graphene.Int(), limit=graphene.Int())
    
    tickets_by_user = graphene.List(SupportTicketType, user=graphene.Int())

    def resolve_all_tickets(self, info, offset:int, limit:int):
        return SupportTicket.objects.all().order_by('closed')[offset: offset+limit]
    
    def resolve_tickets_by_user(self, info, user:int):
        user = User.objects.get(id=user)
        return SupportTicket.objects.filter(user=user, closed=False)

class MessageQueries(graphene.ObjectType):

    get_messages_by_ticket = graphene.List(MessageType, id=graphene.Int(), offset=graphene.Int(), limit=graphene.Int())

    def resolve_get_messages_by_ticket(self,info, id:int, offset:int, limit:int):
        ticket = SupportTicket.objects.get(id = id)
        return Message.objects.filter(ticket=ticket).order_by('-datetime')[offset: offset+limit]
    



