
from graphene_django import DjangoObjectType
from ..models import CartItem, Order
                    

class CartItemType(DjangoObjectType):
    class Meta:
        model = CartItem
        fields = '__all__'


class OrderType(DjangoObjectType):
    class Meta:
        model = Order
        fields = '__all__'


