import graphene
import payments.gql.types as gql_types

from payments.stripe import stripe


class PaymentsQueries(graphene.ObjectType):
    payment_intent_data = graphene.Field(gql_types.PaymentIntentType)

    def resolve_payment_intent_data(self, info):

        test_payment_intent = stripe.PaymentIntent.create(
            amount=1000, currency='pln',
            payment_method_types=['card'],
            receipt_email='test@example.com')

        return gql_types.PaymentIntentType(payment_data=test_payment_intent)
