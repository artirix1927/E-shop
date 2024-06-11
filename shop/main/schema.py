import graphene
from graphene_django import DjangoObjectType

from django.db.models import Q
from .models import Category, Attachment, Product

from django.contrib.auth.models import User


from django.contrib.auth import authenticate, login, logout
from django.core.exceptions import PermissionDenied

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
    
class Query(graphene.ObjectType):
    all_categories = graphene.List(CategoryType)
    all_products = graphene.List(ProductType)
    product_by_id = graphene.Field(ProductType, id=graphene.Int())
    products_by_category = graphene.List(ProductType, category=graphene.String())
    products_by_search = graphene.List(ProductType, search=graphene.String(), category=graphene.String())

    def resolve_all_categories(root, info):
        return Category.objects.all()
    
    def resolve_all_products(root,info):
        return Product.objects.all()
    
    def resolve_product_by_id(root, info, id):
        print(id)
        return Product.objects.get(pk=id)
    
    def resolve_products_by_category(root, info, category):
        return Product.objects.filter(category__shortname=category)
    
    def resolve_products_by_search(root, info, category, search):
        
        category_for_filter = getCategoryByDropdownValue(category)

        return Product.objects.annotate(name_matches=Q(name__icontains=search)).\
               filter((Q(description__icontains=search) | Q(name_matches=True)) & category_for_filter).order_by("-name_matches")
    

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
            login(info.context, user)
            return LoginUser(user=user)
        else: 
            raise PermissionDenied("Invalid credentials") 
       

class LogoutUser(graphene.Mutation):
    success = graphene.Boolean()

    def mutate(self, info):
        logout(info.context)
        return LogoutUser(success=True)
    

class Mutation(graphene.ObjectType):
    create_user= CreateUser.Field()
    login_user = LoginUser.Field()
    logout_user = LogoutUser.Field()


schema = graphene.Schema(query=Query, mutation=Mutation)



def getCategoryByDropdownValue(category_name) -> Q:
    category = Category.objects.filter(name=category_name).first()
    return Q(category=category) if category else Q()