from django.apps import apps

import graphene


from ..classes import FormSerializer, FormRenderer

from django.forms import ModelForm

#from django.core.serializers import serialize
import json



from django.core.serializers.json import DjangoJSONEncoder



model_type_cache = {}

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


    def resolve_form(self, info):
        app_config = apps.get_app_config(self.app_name)
        picked_model = app_config.get_model(self.model_name)
        instance = picked_model.objects.get(id=self.instance_id)
        class Meta:
            model = picked_model
            fields = '__all__'
        
        form_class = type(f'{picked_model.__name__}Form', (ModelForm,), {"Meta": Meta})

        form = form_class(instance=instance)

        form = FormSerializer(form).data
       
       
        rendered_form = FormRenderer(form).render()
        
        json_form = json.dumps(rendered_form, cls=DjangoJSONEncoder)

        return json_form




    

