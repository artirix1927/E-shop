
from math import fabs
from urllib import request
import graphene
from graphene_file_upload.scalars import Upload
from pkg_resources import require

import reviews.models as db_models

from django.contrib.auth.models import User

from products.models import Product


from .queries import redis_cache


class CreateReview(graphene.Mutation):

    success = graphene.Field(graphene.Boolean)

    class Arguments:
        user_id = graphene.Int()
        stars = graphene.Int()
        text = graphene.String()
        product_id = graphene.Int()
        files = Upload(required=False)

    def mutate(self, info, user_id, stars, text, product_id, files=None):
        user = User.objects.get(id=user_id)

        product = Product.objects.get(id=product_id)

        review = db_models.Review.objects.create(
            user=user, stars=stars, text=text, product=product)
        print(user_id, stars, text, product_id, files)
        if files:
            print(files)
            for file_field in files:
                print(files)
                db_models.Attachment.objects.create(
                    image=file_field, review=review)

        redis_cache.clear_by_prefix("admin")
        redis_cache.clear_by_prefix("reviews")

        return CreateReview(success=True)
