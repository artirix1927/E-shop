
import graphene

from chat.gql.mutations_logic import CloseTicket


class SupportTicketMutations(graphene.ObjectType):
    close_ticket = CloseTicket.Field()
