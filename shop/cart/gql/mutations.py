
import graphene
from .mutations_logic import * 


class CartMutations(graphene.ObjectType):
    add_to_cart = AddToCart.Field()
    change_cart_item_quantity = ChangeItemCartQuantity.Field()
    delete_from_cart = DeleteFromCart.Field()


class OrderMutations(graphene.ObjectType):
    create_order = CreateOrder.Field()