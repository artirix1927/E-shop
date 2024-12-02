
import graphene

import cart.gql.mutations_logic as mutations_logic


class CartMutations(graphene.ObjectType):
    add_to_cart = mutations_logic.AddToCart.Field()
    change_cart_item_quantity = mutations_logic.ChangeCartItemQuantity.Field()
    delete_from_cart = mutations_logic.DeleteFromCart.Field()


class OrderMutations(graphene.ObjectType):
    create_checkout_session = mutations_logic.CreateCheckoutSession.Field()
    create_order_after_checkout = mutations_logic.CreateOrder.Field()
