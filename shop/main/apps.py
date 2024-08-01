from django.apps import AppConfig

from .gqlCollector import GqlQueriesAndMutationCollector

from main.schema import set_schema

from graphene import Schema

class MainConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'main'

    def ready(self):
        import main.signals
        
        schema_classes: dict = GqlQueriesAndMutationCollector()()
        
        new_schema = Schema(mutation=schema_classes['Mutations'], query=schema_classes['Queries'])
        
        set_schema(new_schema)
        
        
