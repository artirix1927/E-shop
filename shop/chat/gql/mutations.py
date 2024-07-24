
import graphene

from .mutations_logic import CloseTicket

class SupportTicketMutations(graphene.ObjectType):
    close_ticket = CloseTicket.Field()
