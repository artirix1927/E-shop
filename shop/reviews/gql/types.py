from graphene_django import DjangoObjectType

import reviews.models as db_models


class ReviewAttachmentType(DjangoObjectType):
    def resolve_image(self, info, **kwargs):
        return info.context.build_absolute_uri(self.image.url)
    
    class Meta:
        model=db_models.Attachment
        #fields = ('image', 'product')
        fields = '__all__'


class ReviewType(DjangoObjectType):
    class Meta:
        model = db_models.Review
        fields = '__all__'