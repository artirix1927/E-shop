
from graphene_django import DjangoObjectType
from chat.funcs import get_cached_user_or_request

from chat.models import SupportTicket, Message
import graphene
from django.contrib.auth.models import User


class UserType(DjangoObjectType):
    class Meta:
        model = User
        fields = '__all__'

    @classmethod
    def get_user_by_id(cls, id):
        # Main app URL to get the user data by ID
        user = get_cached_user_or_request(id)
        return user

    def resolve_id(self, info):
        return self.id


class MessageType(DjangoObjectType):
    sent_by = graphene.Field(UserType)

    class Meta:
        model = Message
        fields = '__all__'

    # Custom resolver for sent_by field

    def resolve_sent_by(self, info):
        user_data = UserType.get_user_by_id(self.sent_by)
        return UserType(**user_data)


class SupportTicketType(DjangoObjectType):
    user = graphene.Field(UserType)

    class Meta:
        model = SupportTicket
        fields = '__all__'

    # Custom resolver for user field
    def resolve_user(self, info):
        user_data = UserType.get_user_by_id(self.user)
        return UserType(**user_data)
