
import graphene

import reviews.gql.types as gql_types

import reviews.models as db_models



class ReviewsQueries(graphene.ObjectType):
    #limit_and_offset_params = {'offset': graphene.Int(), 'limit': graphene.Int()}
    all_reviews = graphene.List(gql_types.ReviewType)
    
    
    def resolve_all_reviews(root, info):
        
        queryset = db_models.Review.objects.prefetch_related('attachments').all()
 
        return queryset
    
    