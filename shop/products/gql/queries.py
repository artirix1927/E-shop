import graphene

from .types import CategoryType, ProductType

from ..models import Category, Product

from ..funcs import get_category_by_dropdown_value


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
    


    


