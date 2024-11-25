import graphene

from graphene.types.generic import GenericScalar

from payments.stripe import stripe


class SaveStripeInfo(graphene.Mutation):
    success = graphene.Boolean()

    class Arguments:
        email = graphene.String()
        payment_method_data = GenericScalar()

    def mutate(self, info, email, payment_method_data):
        customer_data = stripe.Customer.list(email=email).data

        if not customer_data:
            payment_method_id = payment_method_data.get('id')

            stripe.Customer.create(
                email=email, payment_method=payment_method_id)
