from django.apps import apps

import graphene


class ModelInstanceType(graphene.ObjectType):
    model_name = graphene.String()
    instances = graphene.JSONString()


class AppType(graphene.ObjectType):
    app_name = graphene.String()
    models = graphene.List(graphene.String)

    def resolve_models(self, info):
        app = apps.get_app_config(self.app_name)
        
        return [model.__name__ for model in app.get_models()]
    

class ModelInstanceFormType(graphene.ObjectType):
    app_name = graphene.String()
    model_name = graphene.String()
    instance_id = graphene.Int()
    form = graphene.String()
    
    
class ModelCreateFormType(graphene.ObjectType):
    app_name = graphene.String()
    model_name = graphene.String()
    form = graphene.String()






    

