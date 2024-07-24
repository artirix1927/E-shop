import graphene
from .types import SupportTicketType, MessageType


from ..models import SupportTicket,Message


class SupportTicketQueries(graphene.ObjectType):
    all_tickets = graphene.List(SupportTicketType)

    def resolve_all_tickets(self, info):
    
        return SupportTicket.objects.all().order_by('closed')

class MessageQueries(graphene.ObjectType):

    get_messages_by_ticket = graphene.List(MessageType, id=graphene.Int())



    def resolve_get_messages_by_ticket(self,info, id):
        ticket = SupportTicket.objects.get(id = id)
        return Message.objects.filter(ticket=ticket).order_by('datetime')


