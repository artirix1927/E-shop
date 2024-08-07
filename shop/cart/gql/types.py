
from graphene_django import DjangoObjectType

import cart.models as db_models 
                    

class CartItemType(DjangoObjectType):
    class Meta:
        model = db_models.CartItem
        fields = '__all__'


class OrderType(DjangoObjectType):
    class Meta:
        model = db_models.Order
        fields = '__all__'


