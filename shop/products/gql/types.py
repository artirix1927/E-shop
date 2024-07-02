
from graphene_django import DjangoObjectType
from ..models import Category, Product, Attachment ,AvailableCharacteristics, Characteristics



class CategoryType(DjangoObjectType):

    class Meta:
        model = Category
        fields = '__all__'

class ProductType(DjangoObjectType):
    class Meta:
        model = Product
        fields = '__all__'
       

class AttachmentType(DjangoObjectType):
    def resolve_image(self, info, **kwargs):
        return info.context.build_absolute_uri(self.image.url)
    
    class Meta:
        model=Attachment
        #fields = ('image', 'product')
        fields = '__all__'


class AvailableCharacteristicsType(DjangoObjectType):
    class Meta:
        model = AvailableCharacteristics
        fields = '__all__'

class CharacteristicsType(DjangoObjectType):
    class Meta:
        model = Characteristics
        fields = '__all__'

