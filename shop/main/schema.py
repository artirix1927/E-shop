import graphene
from graphene_django import DjangoObjectType



from .models import Category, Attachment, Product

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

    



class Query(graphene.ObjectType):
    all_categories = graphene.List(CategoryType)
    all_products = graphene.List(ProductType)
    product_by_id = graphene.Field(ProductType, id=graphene.Int())
    products_by_category = graphene.List(ProductType, category=graphene.String())

    def resolve_all_categories(root, info):
        return Category.objects.all()
    
    def resolve_all_products(root,info):
        return Product.objects.all()
    
    def resolve_product_by_id(root, info, id):
        print(id)
        return Product.objects.get(pk=id)
    
    def resolve_products_by_category(root,info,category):
        return Product.objects.filter(category__shortname=category)
    




schema = graphene.Schema(query=Query)