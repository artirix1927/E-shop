
import hashlib
from pydoc import cli
from django.core.cache import cache

from django.db.models import QuerySet
import products.models as db_models

from django.utils.encoding import force_bytes


from functools import wraps
import time


from django.conf import settings
import redis


class QuerysetCache:
    def __init__(self, key_prefix: str, timeout=300):
        self.key_prefix = key_prefix
        self.timeout = timeout

    def get_cache_key(self, queryset: QuerySet) -> str:
        query_key = hashlib.md5(force_bytes(str(queryset.query))).hexdigest()
        return f"{self.key_prefix}:{query_key}"

    def get(self, queryset: QuerySet):
        connect = self.check_for_connection()
        cache_key = self.get_cache_key(queryset)

        if connect:
            result = cache.get(cache_key)
            if not result:
                result = list(queryset)
                cache.set(cache_key, result, self.timeout)

        else:
            result = list(queryset)

        return result

    def clear_by_prefix(self, prefix: str) -> None:
        keys_found_by_prefix = cache.keys(f'{prefix}:*')
        cache.delete_many(keys_found_by_prefix)

    def check_for_connection(self) -> bool:
        client = redis.StrictRedis.from_url(
            settings.CACHES['default']['LOCATION'])
        try:
            client.ping()
            return True
        except Exception:
            return False
