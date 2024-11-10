import hashlib
from django.core.cache import cache

from django.db.models import QuerySet

from django.utils.encoding import force_bytes


class QuerysetCache:
    def __init__(self, key_prefix: str, timeout=300):
        self.key_prefix = key_prefix
        self.timeout = timeout

    def get_cache_key(self, queryset: QuerySet) -> str:
        query_key = hashlib.md5(force_bytes(str(queryset.query))).hexdigest()
        return f"{self.key_prefix}:{query_key}"

    def get(self, queryset: QuerySet):
        cache_key = self.get_cache_key(queryset)

        try:
            result = cache.get(cache_key)
            if result is None:
                result = list(queryset)
                cache.set(cache_key, result, self.timeout)
        except Exception as e:
            result = list(queryset)

        return result

    def clear_by_prefix(self, prefix: str) -> None:
        keys_found_by_prefix = cache.keys(f'{prefix}:*')
        cache.delete_many(keys_found_by_prefix)
