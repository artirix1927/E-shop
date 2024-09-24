
from graphene_django import DjangoObjectType
import graphene
from ..models import AvailableCountries


class AvailableCountriesType(DjangoObjectType):
    class Meta:
        model = AvailableCountries
        fields = '__all__'


class StatesType(graphene.ObjectType):
    name = graphene.String()


class CitiesType(graphene.ObjectType):
    name = graphene.String()
