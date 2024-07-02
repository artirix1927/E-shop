
from graphene_django import DjangoObjectType
from ..models import AvailableCountries



class AvailableCountriesType(DjangoObjectType):
    class Meta:
        model = AvailableCountries
        fields = '__all__'

