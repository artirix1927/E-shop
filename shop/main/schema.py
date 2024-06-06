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
        fields = ("id", "name", "price", "pieces_left", "description", 'created_at','last_edited_at', 'attachments')



class AttachmentType(DjangoObjectType):
    def resolve_image(self, info, **kwargs):
        return info.context.build_absolute_uri(self.image.url)
    
    class Meta:
        model=Attachment
        fields = ('image', 'product')

    



class Query(graphene.ObjectType):
    all_categories = graphene.List(CategoryType)
    all_products = graphene.List(ProductType)
    attachemnts_by_products = graphene.List(AttachmentType)

    all_attachemnts = graphene.List(AttachmentType)

    def resolve_all_categories(root, info):
        return Category.objects.all()
    
    def resolve_all_products(root,info):
        return Product.objects.all()
    
    def resolve_attachemnts_by_products(root, info, product_id):
        return Attachment.objects.filter(product=product_id)
    
    def resolve_all_attachemnts(root, info):
        print(Attachment.objects.all())
        return Attachment.objects.all()



schema = graphene.Schema(query=Query)