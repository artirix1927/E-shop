
from django.apps import apps
from django.db import models
from admin.classes.managers.base import BasicManager
from shop.cache_class import QuerysetCache
from django.contrib.admin import ModelAdmin


class AppModelManager(BasicManager):

    def __init__(self, registered_models: dict[models.Model, ModelAdmin], redis_cache: QuerysetCache):
        super().__init__(registered_models, redis_cache)

    def get_all_apps_of_registered_models(self) -> set[str]:
        '''get list of all apps that have at least one registered model'''
        if not self._registered_models:
            return {}

        apps_set = set()
        for model in self._registered_models.keys():
            apps_set.add(model._meta.app_label)

        return sorted(apps_set)

    def get_registered_models_by_apps(self) -> dict[str, list[models.Model]]:
        '''get registered models by apps'''

        models_by_app: dict[str, list] = {}

        for model in self._registered_models.keys():
            if not model._meta.app_label in models_by_app.keys():
                models_by_app[model._meta.app_label] = [model, ]
                continue

            models_by_app[model._meta.app_label].append(model)

        return models_by_app

    def _sort_dict_keys_by_alpha(self, models_by_app: dict) -> dict:
        '''accepts dict and returns dict with keys sorted alphabetically'''
        sorted_keys = sorted(models_by_app.keys())
        return {i: models_by_app[i] for i in sorted_keys}

    def get_prepared_registered_models(self) -> dict[str, list[models.Model]]:
        '''gets dict of registered models in each app and sorts the app keys alphabetically'''
        models_by_app = self.get_registered_models_by_apps()
        sorted_models_by_app = self._sort_dict_keys_by_alpha(models_by_app)
        return sorted_models_by_app

    def get_model_by_app_and_name(self, app_name: str, model_name: str) -> models.Model:
        '''get model by app name and model name'''
        app_config = apps.get_app_config(app_name)
        model = app_config.get_model(model_name)

        return model

    def _get_list_of_model_instances(self, model: models.Model, query=None):
        query_to_run = query if query else model.objects.all().order_by('id')

        return self._redis_cache.get(query_to_run)

    def get_model_instances_by_model_and_app(self, app_name: str, model_name: str):
        model = self.get_model_by_app_and_name(app_name, model_name)
        instances = self._get_list_of_model_instances(model)
        return instances
