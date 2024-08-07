import graphene

import shipping.gql.types as gql_types

from shipping.models import AvailableCountries

from shipping.funcs import *


class GeoQueries(graphene.ObjectType):
    available_countries = graphene.List(gql_types.AvailableCountriesType)
    states_by_country = graphene.List(gql_types.StatesType, country=graphene.String())
    cities_by_country_state = graphene.List(gql_types.CitiesType, country=graphene.String(), state=graphene.String())


    def resolve_available_countries(root, info):
        return AvailableCountries.objects.all()
    
    def resolve_states_by_country(root, info, country):
        return (gql_types.StatesType(name=state) for state in get_states_by_country(country))
    
    def resolve_cities_by_country_state(root,info,country,state):
        return (gql_types.CitiesType(name=city) for city in get_cities_by_country_state(country, state))
    


