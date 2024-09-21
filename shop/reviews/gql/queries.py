
import graphene

import reviews.gql.types as gql_types

import reviews.models as db_models

from shop.redis_cache_class import QuerysetCache


redis_cache = QuerysetCache("reviews")


class ReviewsQueries(graphene.ObjectType):
    # limit_and_offset_params = {'offset': graphene.Int(), 'limit': graphene.Int()}
    all_reviews = graphene.List(gql_types.ReviewType)

    def resolve_all_reviews(root, info):

        query = db_models.Review.objects.prefetch_related(
            'attachments').all()

        queryset = redis_cache.get(queryset)
        return query
