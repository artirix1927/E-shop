import graphene

import reviews.gql.mutations_logic as mutations_logic


class ReviewsMutations(graphene.ObjectType):

    create_review = mutations_logic.CreateReview.Field()
