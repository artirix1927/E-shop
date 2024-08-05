
import graphene

from django.apps import apps
from admin.gql.types import AppType, ModelInstanceType, ModelInstanceFormType,ModelCreateFormType

from admin.funcs import exclude_apps_from_settings, get_app_name_without_dots,get_apps_with_models,\
                    get_model_by_app_and_name, get_model_form_class_by_model


import json
from django.core.serializers.json import DjangoJSONEncoder
from admin.classes import FormSerializer, FormRenderer




class AdminQueries(graphene.ObjectType):
    all_apps = graphene.List(AppType)

    model_instances = graphene.Field(ModelInstanceType, app_name=graphene.String(), model_name=graphene.String())

    model_instance_form = graphene.Field(ModelInstanceFormType, app_name=graphene.String(), model_name=graphene.String(), id=graphene.Int())
    
    model_create_form = graphene.Field(ModelCreateFormType, app_name=graphene.String(), model_name=graphene.String() )
   
    def resolve_all_apps(self, info):
        app_configs = apps.get_app_configs()

        app_configs = get_apps_with_models(app_configs)

        app_configs = exclude_apps_from_settings(app_configs)


        return [AppType(get_app_name_without_dots(app.name)) for app in app_configs]
    
    def resolve_model_instances(self, info, app_name, model_name):
        model = get_model_by_app_and_name(app_name, model_name)
        
        instances = model.objects.all().order_by('id')
        
        instances_repr_for_type = [{'instance': str(intsance), 'id': intsance.id} for intsance in instances]
        
        return ModelInstanceType(model_name=model_name, instances=instances_repr_for_type)
    

    def resolve_model_instance_form(self, info, app_name, model_name, id):
        
        picked_model = get_model_by_app_and_name(app_name, model_name)
        instance = picked_model.objects.get(id=id)
        
        form_class = get_model_form_class_by_model(picked_model)

        form = form_class(instance=instance)

        form = FormSerializer(form).data
       
        rendered_form = FormRenderer(form).render()
        
        json_form = json.dumps(rendered_form, cls=DjangoJSONEncoder)
        
        #create metaclass for form
        return ModelInstanceFormType(app_name=app_name,model_name=model_name, instance_id=id, form=json_form)
    
    
    
    def resolve_model_create_form(self, info, app_name, model_name):
        
        picked_model = get_model_by_app_and_name(app_name, model_name)
        
        form_class = get_model_form_class_by_model(picked_model)

        form = form_class()

        form = FormSerializer(form).data
       
        rendered_form = FormRenderer(form).render()
        
        json_form = json.dumps(rendered_form, cls=DjangoJSONEncoder)
        
        return ModelCreateFormType(app_name=app_name, model_name=model_name, form=json_form)
        
        
    

        
