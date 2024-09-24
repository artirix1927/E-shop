

from graphene import Schema


import chat.gql.mutations as gql_mutations

import chat.gql.queries as gql_queries


class Queries(gql_queries.SupportTicketQueries, gql_queries.MessageQueries):
    pass


class Mutations(gql_mutations.SupportTicketMutations):
    pass


schema = Schema(
    mutation=Mutations,
    query=Queries)
