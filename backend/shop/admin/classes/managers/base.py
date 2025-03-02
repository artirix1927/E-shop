from django.db import models
from django.contrib.admin import ModelAdmin


from shop.cache_class import QuerysetCache


class BasicManager:
    _registered_models: dict[models.Model, ModelAdmin]
    _redis_cache: QuerysetCache

    def __init__(self, registered_models: dict[models.Model, ModelAdmin], redis_cache: QuerysetCache):
        self._registered_models = registered_models
        self._redis_cache = redis_cache
