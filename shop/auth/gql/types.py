
from graphene_django import DjangoObjectType
from django.contrib.auth.models import User


import graphene


class UserType(DjangoObjectType):
    id = graphene.Int(source='pk')

    class Meta:
        model = User
        fields = '__all__'
