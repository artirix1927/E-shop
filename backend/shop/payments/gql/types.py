import graphene
from graphene.types.generic import GenericScalar


class PaymentIntentType(graphene.ObjectType):
    payment_data = GenericScalar()
