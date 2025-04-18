

import graphene
from chat.gql.types import SupportTicketType
from chat.models import SupportTicket


class CloseTicket(graphene.Mutation):
    ticket = graphene.Field(SupportTicketType)

    class Arguments:
        ticket_id = graphene.Int()

    def mutate(self, info, *args, **kwargs):
        ticket = SupportTicket.objects.get(id=kwargs.get('ticket_id'))
        ticket.closed = True
        ticket.save()
        return CloseTicket(ticket=ticket)


class CreateTicket(graphene.Mutation):
    ticket = graphene.Field(SupportTicketType)

    class Arguments:
        user_id = graphene.Int(required=True)

    def mutate(self, info, user_id):
        ticket = SupportTicket(user_id=user_id, closed=False)
        ticket.save()
        return CreateTicket(ticket=ticket)
