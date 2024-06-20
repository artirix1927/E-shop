import graphene
from .gql_types import UserType

from django.contrib.auth import authenticate #login, logout
from django.core.exceptions import PermissionDenied

from django.contrib.auth.models import User

from ..models import CartItem,Product

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
        user_product_cart_item = CartItem.objects.filter(user=user, product=product).first()

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
        cart_item = CartItem.objects.get(id=id).delete()
        return DeleteFromCart(success=True)
