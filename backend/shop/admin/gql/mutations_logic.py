
import graphene

from graphene_file_upload.scalars import Upload

import json


import admin.funcs as funcs
from admin.classes.admin import admin


from .queries import redis_cache


class UpdateInstance(graphene.Mutation):
    success = graphene.Field(graphene.Boolean)

    class Arguments:
        app_name = graphene.String()
        model_name = graphene.String()
        instance_id = graphene.Int()
        form_values = graphene.String()
        files = Upload(required=False)

    def mutate(
            self,
            info,
            app_name,
            model_name,
            instance_id,
            form_values,
            files):

        print(files)

        picked_model = admin.apps.get_model_by_app_and_name(
            app_name, model_name)
        instance = picked_model.objects.get(id=instance_id)

        form_class = admin.forms.get_model_form_class_by_model(picked_model)

        form_files_dict = funcs.create_multivalue_dict_for_files(files)
        form_data = json.loads(form_values)

        form = form_class(
            data=form_data,
            files=form_files_dict,
            instance=instance)
        form.save(commit=True)

        redis_cache.clear_by_prefix(app_name)
        redis_cache.clear_by_prefix("admin")

        return UpdateInstance(success=True)


class DeleteInstances(graphene.Mutation):
    success = graphene.Field(graphene.Boolean)

    class Arguments:
        app_name = graphene.String()
        model_name = graphene.String()
        instances = graphene.String()

    def mutate(self, info, app_name, model_name, instances):
        instances_ids = json.loads(instances)

        model = admin.apps.get_model_by_app_and_name(app_name, model_name)
        instances_to_delete = model.objects.filter(pk__in=instances_ids)
        instances_to_delete.delete()

        redis_cache.clear_by_prefix(app_name)
        redis_cache.clear_by_prefix("admin")

        return DeleteInstances(success=True)


class CreateInstance(graphene.Mutation):
    success = graphene.Field(graphene.Boolean)

    class Arguments:
        app_name = graphene.String()
        model_name = graphene.String()
        form_values = graphene.String()
        files = Upload(required=False)

    def mutate(self, info, app_name, model_name, form_values, files):
        picked_model = admin.apps.get_model_by_app_and_name(
            app_name, model_name)

        form_class = admin.forms.get_model_form_class_by_model(picked_model)

        form_files_dict = funcs.create_multivalue_dict_for_files(files)
        form_data = json.loads(form_values)

        form = form_class(data=form_data, files=form_files_dict)
        form.save(commit=True)

        redis_cache.clear_by_prefix(app_name)
        redis_cache.clear_by_prefix("admin")

        return CreateInstance(success=True)
