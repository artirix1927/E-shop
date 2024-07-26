import graphene

from .types import CategoryType, ProductType

from ..models import Category, Product

from ..funcs import get_category_by_dropdown_value


from django.db.models import Q

class ProductQueries(graphene.ObjectType):
    all_products = graphene.List(ProductType, offset=graphene.Int(), limit=graphene.Int())
    products_by_category = graphene.List(ProductType, category=graphene.String(), offset=graphene.Int(), limit=graphene.Int())
    product_by_id = graphene.Field(ProductType, offset=graphene.Int(), limit=graphene.Int(), id=graphene.Int())
    products_by_search = graphene.List(ProductType, offset=graphene.Int(), limit=graphene.Int(), search=graphene.String(), category=graphene.String())

    def resolve_all_products(root,info, offset, limit):
        return Product.objects.all()[offset:offset+limit]
    
    def resolve_product_by_id(root, info, id):
        return Product.objects.get(pk=id)
    
    def resolve_products_by_category(root, info, offset, limit, category):
        return Product.objects.filter(category__name=category)[offset:offset+limit]
    
    def resolve_products_by_search(root, info, offset, limit, category, search):
        
        category_for_filter = get_category_by_dropdown_value(category)

        return Product.objects.annotate(name_matches=Q(name__icontains=search)).\
               filter((Q(description__icontains=search) | Q(name_matches=True)) & category_for_filter).order_by("-name_matches")[offset:offset+limit]
    



class CategoryQueries(graphene.ObjectType):
    all_categories = graphene.List(CategoryType)

    def resolve_all_categories(root, info):
        return Category.objects.all()
    
    


    

