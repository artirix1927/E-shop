
from graphene_django import DjangoObjectType
from ..models import Category,Product,Attachment,CartItem
from django.contrib.auth.models import User


class CategoryType(DjangoObjectType):

    class Meta:
        model = Category
        fields = ("id", "name", "shortname")


class ProductType(DjangoObjectType):
    class Meta:
        model = Product
        fields = ("id", "name", "price", "pieces_left", "description", 'created_at','last_edited_at', 'attachments', 'weight')



class AttachmentType(DjangoObjectType):
    def resolve_image(self, info, **kwargs):
        return info.context.build_absolute_uri(self.image.url)
    
    class Meta:
        model=Attachment
        fields = ('image', 'product')


class UserType(DjangoObjectType):
    class Meta:
        model = User
        fields = ("id", "username", "email")


class CartItemType(DjangoObjectType):
    class Meta:
        model = CartItem
        fields = ("id", "user", "quantity", "product")