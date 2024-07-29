
import graphene

from django.apps import apps
from .types import AppType, ModelInstanceType, ModelInstanceFormType

from ..funcs import get_app_name_without_dots, exclude_apps,get_apps_with_models


class AdminQueries(graphene.ObjectType):
    all_apps = graphene.List(AppType)

    model_instances = graphene.Field(ModelInstanceType, app_name=graphene.String(), model_name=graphene.String())

    model_instance_form = graphene.Field(ModelInstanceFormType, app_name=graphene.String(), model_name=graphene.String(), id=graphene.Int())
   
    def resolve_all_apps(self, info):
        app_configs = apps.get_app_configs()

        app_configs = get_apps_with_models(app_configs)

        app_configs = exclude_apps(app_configs)


        return [AppType(get_app_name_without_dots(app.name)) for app in app_configs]
    
    def resolve_model_instances(self, info, app_name, model_name):
        app_config = apps.get_app_config(app_name)
        model = app_config.get_model(model_name)
        instances = model.objects.all()
        #instances_data = serializers.serialize('json', )
        return ModelInstanceType(model_name=model_name, instances=[{'instance': str(intsance), 'id': intsance.id} for intsance in instances])
    

    def resolve_model_instance_form(self, info, app_name, model_name, id):
        #create metaclass for form
        return ModelInstanceFormType(app_name=app_name,model_name=model_name, instance_id=id)

        
