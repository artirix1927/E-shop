import graphene
from .types import SupportTicketType, MessageType


from ..models import SupportTicket,Message


class SupportTicketQueries(graphene.ObjectType):
    all_tickets = graphene.List(SupportTicketType, offset=graphene.Int(), limit=graphene.Int())

    def resolve_all_tickets(self, info, offset:int, limit:int):
        print(offset,limit)
        return SupportTicket.objects.all().order_by('closed')[offset: offset+limit]

class MessageQueries(graphene.ObjectType):

    get_messages_by_ticket = graphene.List(MessageType, id=graphene.Int(), offset=graphene.Int(), limit=graphene.Int())



    def resolve_get_messages_by_ticket(self,info, id:int, offset:int, limit:int):
        ticket = SupportTicket.objects.get(id = id)
        return Message.objects.filter(ticket=ticket).order_by('-datetime')[offset: offset+limit]


