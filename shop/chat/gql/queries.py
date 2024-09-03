import graphene

from django.contrib.auth.models import User

import chat.gql.types as gql_types

import chat.models as db_models


class SupportTicketQueries(graphene.ObjectType):
    all_tickets = graphene.List(
        gql_types.SupportTicketType,
        offset=graphene.Int(),
        limit=graphene.Int())

    tickets_by_user = graphene.List(
        gql_types.SupportTicketType,
        user=graphene.Int())

    def resolve_all_tickets(self, info, offset: int, limit: int):
        return db_models.SupportTicket.objects.all().order_by('closed')[
            offset: offset + limit]

    def resolve_tickets_by_user(self, info, user: int):
        user = User.objects.get(id=user)
        return db_models.SupportTicket.objects.filter(user=user, closed=False)


class MessageQueries(graphene.ObjectType):

    get_messages_by_ticket = graphene.List(
        gql_types.MessageType,
        id=graphene.Int(),
        offset=graphene.Int(),
        limit=graphene.Int())

    def resolve_get_messages_by_ticket(
            self, info, id: int, offset: int, limit: int):
        ticket = db_models.SupportTicket.objects.get(id=id)
        return db_models.Message.objects.filter(
            ticket=ticket).order_by('-datetime')[offset: offset + limit]
