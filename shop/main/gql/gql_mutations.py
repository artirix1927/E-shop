import graphene
from .gql_types import UserType

from django.contrib.auth import authenticate #login, logout
from django.core.exceptions import PermissionDenied

from django.contrib.auth.models import User

from ..models import CartItem,Product, Order

from ..funcs import exclude_from_dict

import json

class CreateUser(graphene.Mutation):
    user = graphene.Field(UserType)

    class Arguments:
        username = graphene.String(required=True)
        password = graphene.String(required=True)
        email = graphene.String(required=True)

    def mutate(self, info, username, password, email):
        user = User(username=username, email=email)
        user.set_password(password)
        user.save()
        return CreateUser(user=user)
     

class LoginUser(graphene.Mutation):
    user = graphene.Field(UserType)

    class Arguments:
        username = graphene.String(required=True)
        password = graphene.String(required=True)

    def mutate(self, info, username, password):
        user = authenticate(username=username, password=password)
        if user is not None:
            #login(info.context, user)
            return LoginUser(user=user)
        else: 
            raise PermissionDenied("Invalid credentials") 
       

class LogoutUser(graphene.Mutation):
    success = graphene.Boolean()

    def mutate(self, info):
        #logout(info.context)
        return LogoutUser(success=True)
    


class AddToCart(graphene.Mutation):
    success = graphene.Boolean()

    class Arguments:
        user_id = graphene.Int()
        product_id = graphene.Int()
        quantity = graphene.Int()


    def mutate(self, info, user_id, product_id, quantity):
        user = User.objects.get(id=user_id)
        product = Product.objects.get(id=product_id)
        user_product_cart_item = CartItem.objects.get(user=user, product=product)

        if user_product_cart_item:
            user_product_cart_item.quantity+=quantity
        else:
            user_product_cart_item = CartItem(product=product, user=user, quantity=quantity)

        user_product_cart_item.save()
        

        return AddToCart(success=True)
    
class ChangeItemCartQuantity(graphene.Mutation):
    success = graphene.Boolean()

    class Arguments:
        id = graphene.Int()
        quantity = graphene.Int()

    def mutate(self, info, id, quantity):
        
        user_cart_item = CartItem.objects.get(pk=id)
    
        user_cart_item.quantity = quantity
        user_cart_item.save()

        return ChangeItemCartQuantity(success=True)
    
class DeleteFromCart(graphene.Mutation):
    success = graphene.Boolean()
    class Arguments:
        id = graphene.Int()


    def mutate(self, info, id):
        CartItem.objects.get(id=id).delete()
        return DeleteFromCart(success=True)
    




class CreateOrder(graphene.Mutation):
    success = graphene.Boolean()

    class Arguments:
        full_name = graphene.String()
        phone_number = graphene.String()
        country = graphene.String()
        adress = graphene.String()
        city = graphene.String()
        postal_code = graphene.String()
        user = graphene.Int()#id
        items = graphene.String() #json string with id's of cart items

    def mutate(self, info, *args, **kwargs):
        user = User.objects.get(pk = kwargs['user'])
        
        items_id = json.loads(kwargs['items'])

        cart_items = (CartItem.objects.get(pk=cart_item_id) for cart_item_id in items_id)
        
        data_for_order = exclude_from_dict(kwargs, ('items','user'))

        order = Order(**data_for_order, user=user)
        order.save()
    
        order.items.set(cart_items)

        return CreateOrder(success=True)
        
