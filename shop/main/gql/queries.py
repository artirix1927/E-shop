import graphene

from .types import CategoryType, ProductType, CartItemType, AvailableCountriesType

from ..models import Category, Product, CartItem, AvailableCountries
from django.contrib.auth.models import User

from ..funcs import get_category_by_dropdown_value, adjust_cart_item_quantity_to_pieces_left

from ..geo_funcs import *

from django.db.models import Q

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
    

class GeoQueries(graphene.ObjectType):
    available_countries = graphene.List(AvailableCountriesType)
    states_by_country = graphene.List(graphene.String, country=graphene.String())
    cities_by_country_state = graphene.List(graphene.String, country=graphene.String(), state=graphene.String())


    def resolve_available_countries(root, info):
        return AvailableCountries.objects.all()
    
    def resolve_states_by_country(root, info, country):
        return get_states_by_country(country)
    
    def resolve_cities_by_country_state(root,info,country,state):
        return get_cities_by_country_state(country, state)
    


