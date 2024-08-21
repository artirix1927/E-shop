from django.apps import AppConfig

from .gqlCollector import GqlQueriesAndMutationCollector

from shop.schema import set_schema

from graphene import Schema

class ShopConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'shop'

    def ready(self):
        import shop.signals
        
        schema_classes: dict = GqlQueriesAndMutationCollector().collect()
        
        new_schema = Schema(mutation=schema_classes['Mutations'], query=schema_classes['Queries'])
        
        set_schema(new_schema)
        
        
