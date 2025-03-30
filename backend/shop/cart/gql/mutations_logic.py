from sre_constants import SUCCESS
import graphene

from django.contrib.auth.models import User

import cart.funcs as funcs
import cart.models as db_models

import json

from .types import CartItemType


from payments.stripe import stripe


class AddToCart(graphene.Mutation):
    cart_item = graphene.Field(CartItemType)

    class Arguments:
        user_id = graphene.Int()
        product_id = graphene.Int()
        quantity = graphene.Int()

    def mutate(self, info, user_id, product_id, quantity):
        user = User.objects.get(id=user_id)
        product = db_models.Product.objects.get(id=product_id)
        user_cart_item = db_models.CartItem.objects.filter(
            user=user, product=product).first()

        if user_cart_item:
            user_cart_item.quantity += quantity
        else:
            user_cart_item = db_models.CartItem(
                product=product, user=user, quantity=quantity)

        user_cart_item.save()

        return AddToCart(cart_item=user_cart_item)


class ChangeCartItemQuantity(graphene.Mutation):
    cart_item = graphene.Field(CartItemType)

    class Arguments:
        id = graphene.Int()
        quantity = graphene.Int()

    def mutate(self, info, id, quantity):

        user_cart_item = db_models.CartItem.objects.get(pk=id)

        user_cart_item.quantity = quantity
        user_cart_item.save()

        return ChangeCartItemQuantity(cart_item=user_cart_item)


class DeleteFromCart(graphene.Mutation):
    success = graphene.Boolean()

    class Arguments:
        id = graphene.Int()

    def mutate(self, info, id):
        db_models.CartItem.objects.get(id=id).delete()
        return DeleteFromCart(success=True)


class CreateCheckoutSession(graphene.Mutation):
    checkout_url = graphene.String()

    class Arguments:
        user = graphene.Int(required=True)
        items = graphene.String(required=False)  # Cart item IDs as JSON
        product_id = graphene.Int(required=False)  # For "Buy Now"
        quantity = graphene.Int(required=False)  # For "Buy Now"

    def mutate(self, info, user, items=None, product_id=None, quantity=None):
        if items:
            # Handle cart checkout
            items_id = json.loads(items)
            cart_items = db_models.CartItem.get_cart_items_by_ids(items_id)
            line_items = [
                {"price": item.product.stripe_price_id, "quantity": item.quantity}
                for item in cart_items
            ]
        elif product_id and quantity:
            # Handle "Buy Now"
            product = db_models.Product.objects.get(id=product_id)
            line_items = [
                {"price": product.stripe_price_id, "quantity": quantity}]
        else:
            raise Exception(
                "Invalid input: Provide either cart items or product_id and quantity.")

        # Create the Stripe session
        checkout_session = stripe.checkout.Session.create(
            line_items=line_items,
            mode="payment",
            success_url="http://localhost:3000/create-order-after-checkout",
            cancel_url="http://localhost:3000/cancel",
        )

        print(checkout_session.url)
        return CreateCheckoutSession(checkout_url=checkout_session.url)


class CreateOrder(graphene.Mutation):
    success = graphene.Boolean()

    class Arguments:
        full_name = graphene.String()
        phone_number = graphene.String()
        country = graphene.String()
        adress = graphene.String()
        city = graphene.String()
        state = graphene.String()
        postal_code = graphene.String()
        user = graphene.Int()  # id
        # json string with id's of cart items

        items = graphene.String(required=False)

        product_id = graphene.Int(required=False)
        quantity = graphene.Int(required=False)

        buy_now_order = graphene.Boolean()

    def mutate(self, info, *args, **kwargs):
        user = User.objects.get(pk=kwargs['user'])

        kwargs.pop('user')
        is_buy_now = kwargs.pop('buy_now_order')

        data_for_order = funcs.exclude_from_dict(
            kwargs, ('product_id', 'quantity')) if is_buy_now else funcs.exclude_from_dict(kwargs, ('items',))

        order = db_models.Order.objects.create(**data_for_order, user=user)

        if is_buy_now:

            data_for_order_item = funcs.exclude_from_dict(
                kwargs, data_for_order.keys())

            order_item = db_models.OrderItem.objects.create(
                **data_for_order_item, order=order, user=user)

            db_models.CartItem.change_product_pieces_left_after_order([
                                                                      order_item])

            return CreateOrder(success=True)

        items_id = json.loads(kwargs['items'])

        cart_items = db_models.CartItem.get_cart_items_by_ids(items_id)

        order_items = db_models.CartItem.create_order_items_for_cart_items(
            cart_items, order)

        db_models.CartItem.change_product_pieces_left_after_order(
            order_items)

        return CreateOrder(success=True)
