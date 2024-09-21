
import graphene

from django.apps import apps

import admin.gql.types as gql_types

import admin.funcs as funcs

import json
from django.core.serializers.json import DjangoJSONEncoder
from admin.classes import FormSerializer, FormRenderer


from shop.redis_cache_class import QuerysetCache


redis_cache = QuerysetCache("admin")


class AdminQueries(graphene.ObjectType):
    all_apps = graphene.List(gql_types.AppType)

    model_instances = graphene.Field(
        gql_types.ModelInstanceType,
        app_name=graphene.String(),
        model_name=graphene.String())

    model_instance_form = graphene.Field(
        gql_types.ModelInstanceFormType,
        app_name=graphene.String(),
        model_name=graphene.String(),
        id=graphene.Int())

    model_create_form = graphene.Field(
        gql_types.ModelCreateFormType,
        app_name=graphene.String(),
        model_name=graphene.String())

    def resolve_all_apps(self, info):
        app_configs = apps.get_app_configs()

        app_configs = funcs.get_apps_with_models(app_configs)

        app_configs = funcs.exclude_apps_from_settings(app_configs)

        return [
            gql_types.AppType(
                funcs.get_app_name_without_dots(
                    app.name)) for app in app_configs]

    def resolve_model_instances(self, info, app_name, model_name):
        model = funcs.get_model_by_app_and_name(app_name, model_name)

        query = model.objects.all().order_by('id')
        queryset = redis_cache.get(query)

        instances_repr_for_type = [
            {'instance': str(intsance), 'id': intsance.id} for intsance in queryset]

        return gql_types.ModelInstanceType(
            model_name=model_name,
            instances=instances_repr_for_type)

    def resolve_model_instance_form(self, info, app_name, model_name, id):

        picked_model = funcs.get_model_by_app_and_name(app_name, model_name)
        instance = picked_model.objects.get(id=id)

        form_class = funcs.get_model_form_class_by_model(picked_model)

        form = form_class(instance=instance)

        form = FormSerializer(form).data

        rendered_form = FormRenderer(form).render()

        json_form = json.dumps(rendered_form, cls=DjangoJSONEncoder)

        # create metaclass for form
        return gql_types.ModelInstanceFormType(
            app_name=app_name,
            model_name=model_name,
            instance_id=id,
            form=json_form)

    def resolve_model_create_form(self, info, app_name, model_name):

        picked_model = funcs.get_model_by_app_and_name(app_name, model_name)

        form_class = funcs.get_model_form_class_by_model(picked_model)

        form = form_class()

        form = FormSerializer(form).data

        rendered_form = FormRenderer(form).render()

        json_form = json.dumps(rendered_form, cls=DjangoJSONEncoder)

        return gql_types.ModelCreateFormType(
            app_name=app_name, model_name=model_name, form=json_form)
