import graphene

from django.db.models import Q
from .models import Category, Product, CartItem

from django.contrib.auth.models import User

from .gql.gql_mutations import CreateUser, LoginUser, LogoutUser, AddToCart, \
                                ChangeItemCartQuantity, DeleteFromCart, CreateOrder

from .gql.gql_types import CategoryType, ProductType, CartItemType

from .funcs import adjust_cart_item_quantity_to_pieces_left, get_category_by_dropdown_value


class ProductQueries(graphene.ObjectType):
    all_products = graphene.List(ProductType)
    products_by_category = graphene.List(ProductType, category=graphene.String())
    product_by_id = graphene.Field(ProductType, id=graphene.Int())
    products_by_search = graphene.List(ProductType, search=graphene.String(), category=graphene.String())

    def resolve_all_products(root,info):
        return Product.objects.all()
    
    def resolve_product_by_id(root, info, id):
        return Product.objects.get(pk=id)
    
    def resolve_products_by_category(root, info, category):
        return Product.objects.filter(category__shortname=category)
    
    def resolve_products_by_search(root, info, category, search):
        
        category_for_filter = get_category_by_dropdown_value(category)

        return Product.objects.annotate(name_matches=Q(name__icontains=search)).\
               filter((Q(description__icontains=search) | Q(name_matches=True)) & category_for_filter).order_by("-name_matches")



class CategoryQueries(graphene.ObjectType):
    all_categories = graphene.List(CategoryType)

    def resolve_all_categories(root, info):
        return Category.objects.all()
    


class CartQueries(graphene.ObjectType):
    cart_by_user = graphene.List(CartItemType, id=graphene.Int())

    def resolve_cart_by_user(root, info, id):
        user_cart_items = CartItem.objects.filter(user=User.objects.get(pk=id))
        adjusted_cart_items = adjust_cart_item_quantity_to_pieces_left(user_cart_items)

        return adjusted_cart_items



class Query(ProductQueries, CategoryQueries, CartQueries):
    pass


class Mutation(graphene.ObjectType):
    create_user= CreateUser.Field()
    login_user = LoginUser.Field()
    logout_user = LogoutUser.Field()
    add_to_cart = AddToCart.Field()
    change_cart_item_quantity = ChangeItemCartQuantity.Field()
    delete_from_cart = DeleteFromCart.Field()
    create_order = CreateOrder.Field()



schema = graphene.Schema(query=Query, mutation=Mutation)





