import graphene

from .types import AvailableCountriesType

from ..models import AvailableCountries


from ..funcs import *


class GeoQueries(graphene.ObjectType):
    available_countries = graphene.List(AvailableCountriesType)
    states_by_country = graphene.List(graphene.String, country=graphene.String())
    cities_by_country_state = graphene.List(graphene.String, country=graphene.String(), state=graphene.String())


    def resolve_available_countries(root, info):
        return AvailableCountries.objects.all()
    
    def resolve_states_by_country(root, info, country):
        return get_states_by_country(country)
    
    def resolve_cities_by_country_state(root,info,country,state):
        return get_cities_by_country_state(country, state)
    


