
import graphene
from graphene_file_upload.scalars import Upload

import reviews.models as db_models

from django.contrib.auth.models import User

from products.models import Product


class CreateReview(graphene.Mutation):
    
    success = graphene.Field(graphene.Boolean)
    
    class Arguments: 
        user_id = graphene.Int()
        stars = graphene.Int()
        text = graphene.String()
        product_id = graphene.Int()
        files = Upload(required=False)
        
    def mutate(self, info, user_id, stars, text,product_id, files=None):
        user = User.objects.get(id=user_id)
        
        product = Product.objects.get(id=product_id)
        
        product = Product.objects.get(id=product_id)
        review = db_models.Review.objects.create(user=user, stars=stars, text=text, product=product)
        
        
        if files:
            for file_field in files:
                db_models.Attachment.objects.create(image = file_field['file'], review=review)
        
        
        return CreateReview(success=True)