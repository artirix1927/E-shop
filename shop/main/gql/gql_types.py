
from graphene_django import DjangoObjectType
from ..models import Category,Product,Attachment,CartItem, Order
from django.contrib.auth.models import User


class CategoryType(DjangoObjectType):

    class Meta:
        model = Category
        fields = '__all__'
        #fields = ("id", "name", "shortname")


class ProductType(DjangoObjectType):
    class Meta:
        model = Product
        fields = '__all__'
        #fields = ("id", "name", "price", "pieces_left", "description", 'created_at','last_edited_at', 'attachments', 'weight')



class AttachmentType(DjangoObjectType):
    def resolve_image(self, info, **kwargs):
        return info.context.build_absolute_uri(self.image.url)
    
    class Meta:
        model=Attachment
        #fields = ('image', 'product')
        fields = '__all__'


class UserType(DjangoObjectType):
    class Meta:
        model = User
        #fields = ("id", "username", "email")
        fields = '__all__'


class CartItemType(DjangoObjectType):
    class Meta:
        model = CartItem
        #fields = ("id", "user", "quantity", "product")
        fields = '__all__'


class OrderType(DjangoObjectType):
    class Meta:
        model = Order
        fields = '__all__'