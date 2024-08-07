
from graphene_django import DjangoObjectType
#from ..models import Category, Product, Attachment ,AvailableCharacteristics, Characteristics

import products.models as db_models



class CategoryType(DjangoObjectType):

    class Meta:
        model = db_models.Category
        fields = '__all__'

class ProductType(DjangoObjectType):
    class Meta:
        model = db_models.Product
        fields = '__all__'
       

class AttachmentType(DjangoObjectType):
    def resolve_image(self, info, **kwargs):
        return info.context.build_absolute_uri(self.image.url)
    
    class Meta:
        model=db_models.Attachment
        #fields = ('image', 'product')
        fields = '__all__'


class AvailableCharacteristicsType(DjangoObjectType):
    class Meta:
        model = db_models.AvailableCharacteristics
        fields = '__all__'

class CharacteristicsType(DjangoObjectType):
    class Meta:
        model = db_models.Characteristics
        fields = '__all__'

