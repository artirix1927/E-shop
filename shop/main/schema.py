import graphene

from .gql.queries import ProductQueries, CategoryQueries, CartQueries, GeoQueries
from .gql.mutations import RegistrationMutations, CartMutations, OrderMutations




class Query(ProductQueries, CategoryQueries, CartQueries, GeoQueries):
    pass


class Mutation(RegistrationMutations, CartMutations, OrderMutations):
    pass


schema = graphene.Schema(query=Query, mutation=Mutation)





