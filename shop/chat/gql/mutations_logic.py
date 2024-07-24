
import graphene

from .types import SupportTicketType
from ..models import SupportTicket




class CloseTicket(graphene.Mutation):
    ticket = graphene.Field(SupportTicketType)

    class Arguments:
        ticket_id = graphene.Int()

    def mutate(self, info, *args, **kwargs):
        ticket = SupportTicket.objects.get(id=kwargs.get('ticket_id'))
        ticket.closed=True
        ticket.save()
        return CloseTicket(ticket=ticket)