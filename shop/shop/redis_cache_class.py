
import hashlib
from django.core.cache import cache

from django.db.models import QuerySet
import products.models as db_models

from django.utils.encoding import force_bytes


from functools import wraps
import time


def timeit(func):
    @wraps(func)
    def timeit_wrapper(*args, **kwargs):
        start_time = time.perf_counter()
        result = func(*args, **kwargs)
        end_time = time.perf_counter()
        total_time = end_time - start_time
        print(f'Function {func.__name__}{args} {
              kwargs} Took {total_time:.4f} seconds')
        return result
    return timeit_wrapper

# @timeit
# def get_cached_products_queryset(offset: int, limit: int, filter: dict) -> QuerySet:
#     cache_key = f'products_{offset}:{offset+limit}'
#     queryset = cache.get(cache_key)

#     print(queryset)
#     if not queryset:
#         queryset = list(db_models.Product.objects.prefetch_related('attachments').all()[offset: offset+limit])
#         cache.set(cache_key, queryset, timeout=300)

#     return queryset


class QuerysetCache:
    def __init__(self, key_prefix: str, timeout=300):
        self.key_prefix = key_prefix
        self.timeout = timeout

    def get_cache_key(self, queryset: QuerySet) -> str:
        query_key = hashlib.md5(force_bytes(str(queryset.query))).hexdigest()
        return f"{self.key_prefix}:{query_key}"

    @timeit
    def get(self, queryset: QuerySet):
        cache_key = self.get_cache_key(queryset)
        result = cache.get(cache_key)
        if result is None:
            result = list(queryset)
            cache.set(cache_key, result, self.timeout)
        return result
