from django.core.cache import caches
import hashlib
from django.utils.encoding import force_bytes
from django.conf import settings


class QuerysetCache:
    def __init__(self, key_prefix: str, timeout=60):
        self.key_prefix = key_prefix
        self.timeout = timeout
        # Dynamically choose cache backend
        self.cache = caches[settings.DEFAULT_CACHE]

    def get_cache_key(self, queryset):
        query_key = hashlib.md5(force_bytes(str(queryset.query))).hexdigest()
        return f"{self.key_prefix}:{query_key}"

    def get(self, queryset):
        cache_key = self.get_cache_key(queryset)
        result = None
        result = self.cache.get(cache_key)
        if result is None:
            result = list(queryset)
            self.cache.set(cache_key, result, self.timeout)

        return result

    def clear_by_prefix(self, prefix):
        keys = None
        if self.cache.__class__.__name__ == 'LocMemCache':
            keys = [key for key in self.cache._cache.keys()
                    if key.startswith(prefix)]

        if keys is None:
            keys = self.cache.keys(f"{prefix}:*")

        self.cache.delete_many(keys)

    def set_custom_cache(self, key: str, value):
        """Cache any custom data"""
        cache_key = f"{self.key_prefix}:{key}"
        self.cache.set(cache_key, value, self.timeout)

    def get_custom_cache(self, key: str):
        """Retrieve cached custom data"""
        cache_key = f"{self.key_prefix}:{key}"
        return self.cache.get(cache_key)
