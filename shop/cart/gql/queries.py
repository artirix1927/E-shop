import graphene

from cart.gql.types import CartItemType

from cart.models import CartItem

from django.contrib.auth.models import User

from cart.funcs import  adjust_cart_item_quantity_to_pieces_left

    


class CartQueries(graphene.ObjectType):
    cart_by_user = graphene.List(CartItemType, id=graphene.Int())

    def resolve_cart_by_user(root, info, id):
        user_cart_items = CartItem.objects.filter(user=User.objects.get(pk=id))
        
        adjusted_cart_items = adjust_cart_item_quantity_to_pieces_left(user_cart_items)

        return adjusted_cart_items
    



