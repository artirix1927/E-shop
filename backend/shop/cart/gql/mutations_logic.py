import graphene

from django.contrib.auth.models import User

import cart.funcs as funcs
import cart.models as db_models

import json

from .types import CartItemType


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


class CreateOrderFromCart(graphene.Mutation):
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

    def mutate(self, info, *args, **kwargs):
        user = User.objects.get(pk=kwargs['user'])

        items_id = json.loads(kwargs['items'])

        cart_items = db_models.CartItem.get_cart_items_by_ids(items_id)

        data_for_order = funcs.exclude_from_dict(
            kwargs, ('items', 'user'))

        order = db_models.Order.objects.create(**data_for_order, user=user)

        order_items = db_models.CartItem.create_order_items_for_cart_items(
            cart_items, order)

        db_models.CartItem.change_product_pieces_left_after_order(order_items)

        cart_items.delete()

        return CreateOrderFromCart(success=True)


class CreateBuyNowOrder(graphene.Mutation):
    success = graphene.Boolean()

    class Arguments:

        product_id = graphene.Int()
        quantity = graphene.Int()
        user = graphene.Int()  # id

        full_name = graphene.String()
        phone_number = graphene.String()
        country = graphene.String()
        adress = graphene.String()
        city = graphene.String()
        state = graphene.String()
        postal_code = graphene.String()

    def mutate(self, info, *args, **kwargs):
        user = User.objects.get(pk=kwargs['user'])

        kwargs.pop('user')

        data_for_order = funcs.exclude_from_dict(
            kwargs, ('product_id', 'quantity'))

        data_for_order_item = funcs.exclude_from_dict(
            kwargs, data_for_order.keys())

        order = db_models.Order.objects.create(**data_for_order, user=user)
        order_item = db_models.OrderItem.objects.create(
            **data_for_order_item, order=order, user=user)

        db_models.CartItem.change_product_pieces_left_after_order([order_item])

        return CreateBuyNowOrder(success=True)
