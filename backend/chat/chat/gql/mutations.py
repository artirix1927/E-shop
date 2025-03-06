
import graphene

from chat.gql.mutations_logic import CloseTicket, CreateTicket


class SupportTicketMutations(graphene.ObjectType):
    close_ticket = CloseTicket.Field()
    create_ticket = CreateTicket.Field()
