
import graphene

import admin.gql.types as gql_types

import json
from django.core.serializers.json import DjangoJSONEncoder
from admin.classes.admin import admin

# from admin.classes.serializers import FilterSerializer
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

    model_filters = graphene.Field(
        gql_types.ModelFiltersType,
        app_name=graphene.String(),
        model_name=graphene.String()

    )

    run_filter = graphene.Field(
        gql_types.ModelInstanceType,
        app_name=graphene.String(),
        model_name=graphene.String(),
        query_string=graphene.String(),

    )

    run_search = graphene.Field(
        gql_types.ModelInstanceType,
        app_name=graphene.String(),
        model_name=graphene.String(),
        search_string=graphene.String(),
        filter_query_string=graphene.String(),


    )

    def resolve_all_apps(self, info):
        models_by_apps = admin.apps.get_registered_models_by_apps()

        # for app, models in models_by_apps.items():

        #     admin.filters.get_admin_list_filters(models[0], info.context)
        prepared_types_list = [gql_types.AppType(app_name=app, models=models)
                               for app, models in models_by_apps.items()]

        return prepared_types_list

    def resolve_model_instances(self, info, app_name, model_name):
        instances = admin.apps.get_model_instances_by_model_and_app(
            app_name, model_name)

        instances_repr_for_type = [
            {'instance': str(intsance), 'id': intsance.id} for intsance in instances]

        return gql_types.ModelInstanceType(
            model_name=model_name,
            instances=instances_repr_for_type)

    def resolve_run_search(self, info, app_name, model_name, search_string, filter_query_string=None):
        model = admin.apps.get_model_by_app_and_name(app_name, model_name)
        search_results = admin.search.search(
            model, search_string, filter_query_string)

        instances_repr_for_type = [
            {'instance': str(intsance), 'id': intsance.id} for intsance in search_results]

        return gql_types.ModelInstanceType(
            model_name=model_name,
            instances=instances_repr_for_type)

    def resolve_model_instance_form(self, info, app_name, model_name, id):

        model = admin.apps.get_model_by_app_and_name(
            app_name, model_name)

        instance = model.objects.get(id=id)

        rendered_form = admin.forms.get_rendered_form_data(model, instance)

        json_form = json.dumps(rendered_form, cls=DjangoJSONEncoder)

        admin.forms.get_rendered_form_html(model, instance)

        # create metaclass for form
        return gql_types.ModelInstanceFormType(
            app_name=app_name,
            model_name=model_name,
            instance_id=id,
            form=json_form)

    def resolve_model_create_form(self, info, app_name, model_name):
        model = admin.apps.get_model_by_app_and_name(
            app_name, model_name)

        rendered_form = admin.forms.get_rendered_form_data(model)

        json_form = json.dumps(rendered_form, cls=DjangoJSONEncoder)

        admin.forms.get_rendered_form_html(model)

        return gql_types.ModelCreateFormType(
            app_name=app_name, model_name=model_name, form=json_form)

    def resolve_model_filters(self, info, app_name, model_name):
        model = admin.apps.get_model_by_app_and_name(
            app_name, model_name)

        filters = admin.filters.get_admin_list_filters(model, info.context)
        if filters:
            for i in range(len(filters)):
                filters[i] = str(filters[i])

        return gql_types.ModelFiltersType(app_name=app_name, model_name=model_name, filters_data=json.dumps(filters))

    def resolve_run_filter(self, info, app_name, model_name, query_string):
        model = admin.apps.get_model_by_app_and_name(
            app_name, model_name)

        queryset = admin.filters.run_filter(model, query_string)

        prepared_instances_list = [
            {'instance': str(intsance), 'id': intsance.id} for intsance in queryset]

        return gql_types.ModelInstanceType(
            model_name=model_name,
            instances=prepared_instances_list)
