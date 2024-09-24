
import graphene

import cart.gql.mutations_logic as mutations_logic


class CartMutations(graphene.ObjectType):
    add_to_cart = mutations_logic.AddToCart.Field()
    change_cart_item_quantity = mutations_logic.ChangeCartItemQuantity.Field()
    delete_from_cart = mutations_logic.DeleteFromCart.Field()


class OrderMutations(graphene.ObjectType):
    create_order_from_cart = mutations_logic.CreateOrderFromCart.Field()
    create_buy_now_order = mutations_logic.CreateBuyNowOrder.Field()
