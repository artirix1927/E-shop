import graphene
from auth.gql.types import UserType


from django.contrib.auth import authenticate  # login, logout
from django.core.exceptions import PermissionDenied

from django.contrib.auth.models import User
from django.contrib.auth.models import update_last_login


class CreateUser(graphene.Mutation):
    user = graphene.Field(UserType)

    class Arguments:
        username = graphene.String(required=True)
        password = graphene.String(required=True)
        email = graphene.String(required=True)

    def mutate(self, info, username, password, email):
        user = User(username=username, email=email)
        user.set_password(password)
        user.save()
        return CreateUser(user=user)


class LoginUser(graphene.Mutation):
    user = graphene.Field(UserType)

    class Arguments:
        username = graphene.String(required=True)
        password = graphene.String(required=True)

    def mutate(self, info, username, password):
        user = authenticate(username=username, password=password)

        if user is not None:
            # login(info.context, user)
            update_last_login(None, user)
            return LoginUser(user=user)
        else:
            raise PermissionDenied("Invalid credentials")


class LogoutUser(graphene.Mutation):
    success = graphene.Boolean()

    def mutate(self, info):
        # logout(info.context)
        return LogoutUser(success=True)
