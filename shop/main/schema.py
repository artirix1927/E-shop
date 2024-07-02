import graphene


from .gql.mutations import RegistrationMutations

from products.gql.queries import ProductQueries,CategoryQueries
from cart.gql.queries import CartQueries
from shipping.gql.queries import GeoQueries


from cart.gql.mutations import CartMutations, OrderMutations



class Query(ProductQueries, CategoryQueries, CartQueries, GeoQueries):
    pass


class Mutation(RegistrationMutations, CartMutations, OrderMutations):
    pass


schema = graphene.Schema(query=Query, mutation=Mutation)





