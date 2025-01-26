
from django.db import models
from django.contrib.admin import ModelAdmin

from shop.redis_cache_class import QuerysetCache
from .base import BasicManager
from itertools import chain
from django.db.models import QuerySet


class SearchModelManager(BasicManager):
    def __init__(self, registered_models: dict[models.Model, ModelAdmin], redis_cache: QuerysetCache):
        super().__init__(registered_models, redis_cache)

    def search(self, model: models.Model, search_string: str):
        queryset = model.objects.all()
        model_admin = self._registered_models[model]

        # Call the existing `get_search_results` method
        search_results = model_admin.get_search_results(
            None, queryset, search_string)

        return search_results[0]
