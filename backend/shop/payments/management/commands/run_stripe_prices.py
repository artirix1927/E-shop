

from math import prod
from django.core.management.base import BaseCommand
from requests import delete
import products.models as product_models

from payments.stripe import stripe
import stripe.error


class Command(BaseCommand):
    help = "Create prices for models that are not in stripe"

    def handle(self, *args, **options):
        current_prices_list = stripe.Price.list()

        match_products = []

        all_products = product_models.Product.objects.all()
        for product in all_products:

            for stripe_price in current_prices_list:

                price_in_dollars = stripe_price.unit_amount/100

                stripe_product_for_price = stripe.Product.retrieve(
                    stripe_price.product)

                if stripe_product_for_price.name == product.name and price_in_dollars == product.price:
                    match_products.append(product)

        products_to_create_price_for = list(
            set(all_products) - set(match_products))

        for product in products_to_create_price_for:
            metadata = product.__dict__

            created_stripe_product = stripe.Product.create(
                name=product.name, description=product.description, metadata=metadata)

            # deleting the product if price failed to create
            try:
                created_stripe_price = stripe.Price.create(
                    product=created_stripe_product.id, unit_amount_decimal=product.price*100, currency="CAD")

                product.stripe_product_id = created_stripe_product.id
                product.stripe_price_id = created_stripe_price.id
                product.save()
            except Exception:
                created_stripe_product.delete()
