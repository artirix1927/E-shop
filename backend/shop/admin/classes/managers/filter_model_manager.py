import urllib
from django.contrib.admin.filters import FieldListFilter, AllValuesFieldListFilter
from django.db import models
from django.contrib.admin import ModelAdmin


from shop.redis_cache_class import QuerysetCache


from .base import BasicManager


class FilterModelManager(BasicManager):

    def __init__(self, registered_models: dict[models.Model, ModelAdmin], redis_cache: QuerysetCache):
        super().__init__(registered_models, redis_cache)

    def get_admin_list_filters(self, model: models.Model, request):
        """
        Get list filters for the given ModelAdmin instance as a serialized dictionary.
        """

        # Get the list of filters from the model admin
        model_admin = self._registered_models.get(model)

        if not model_admin:
            return None

        if not model_admin.list_filter:
            return None

        serialized_filters = []

        for filter_spec in model_admin.get_list_filter(None):
            field_name = filter_spec

            filter_data = {
                'field_name': field_name,
                'choices': [],
            }

            field = model_admin.model._meta.get_field(field_name)

            params_for_filter_init = (field,
                                      request,
                                      {},
                                      model,
                                      model_admin,
                                      field_name)
            try:
                default_filter_instance = FieldListFilter.create(
                    *params_for_filter_init
                )
            except Exception as e:
                default_filter_instance = AllValuesFieldListFilter.create(
                    *params_for_filter_init
                )

            change_list = model_admin.get_changelist_instance(request)

            filter_data['choices'] = list(
                default_filter_instance.choices(change_list))

            serialized_filters.append(filter_data)

        return serialized_filters

    def get_query_params_by_string(self, query_string: str):
        if not query_string or query_string == "?":
            return {}  # Return an empty dictionary for an empty query string

        encoded_query_string = urllib.parse.unquote_plus(
            query_string.strip("?"))
        print(encoded_query_string)
        query_params = dict((encoded_query_string.split("="),))

        return query_params

    def run_filter(self, model: models.Model, query_string: str):
        print(query_string)

        query_params = self.get_query_params_by_string(query_string)
        print(123)
        print(model.objects.filter(**query_params))
        queryset = self._redis_cache.get(
            model.objects.filter(**query_params))

        return queryset

    def set_related_choices(self, field, filter_data: dict) -> dict:
        filter_data = filter_data.copy()

        filter_data['choices'] = [
            {'display': str(obj), 'value': obj.pk}
            for obj in field.related_model.objects.all()
        ]

        return filter_data
