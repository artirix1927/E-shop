
from django.db import models
from django.contrib.admin import ModelAdmin

from shop.redis_cache_class import QuerysetCache
from .base import BasicManager


class SearchModelManager(BasicManager):
    def __init__(self, registered_models: dict[models.Model, ModelAdmin], redis_cache: QuerysetCache):
        super().__init__(registered_models, redis_cache)

    def search(self, model: models.Model, search_string: str, filter_query_string: str | None):
        queryset = model.objects.all()

        if (filter_query_string):
            from admin.classes.admin import admin

            query_params = admin.filters.get_query_params_by_string(
                filter_query_string)

            queryset = model.objects.filter(**query_params)

        model_admin = self._registered_models[model]

        search_results = model_admin.get_search_results(
            None, queryset, search_string)

        return search_results[0]
