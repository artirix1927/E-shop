import graphene

import payments.gql.mutations_logic as mutations_logic


class PaymentsMutations(graphene.ObjectType):

    save_stripe_info = mutations_logic.SaveStripeInfo.Field()
