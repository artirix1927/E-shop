import graphene


from products.gql.queries import ProductQueries,CategoryQueries
from cart.gql.queries import CartQueries
from shipping.gql.queries import GeoQueries
from chat.gql.gueries import SupportTicketQueries, MessageQueries


from .gql.mutations import RegistrationMutations
from cart.gql.mutations import CartMutations, OrderMutations
from chat.gql.mutations import SupportTicketMutations




class Query(ProductQueries, CategoryQueries, CartQueries,
            GeoQueries, SupportTicketQueries, MessageQueries):
    pass


class Mutation(RegistrationMutations, CartMutations, OrderMutations, SupportTicketMutations):
    pass


schema = graphene.Schema(query=Query, mutation=Mutation)





