
import urllib
from django.contrib.admin.filters import FieldListFilter, AllValuesFieldListFilter
from django.apps import apps
from django.db import models
from django.contrib.admin import ModelAdmin
from django.forms import ModelForm


from admin.classes.renderers import FormRenderer
from admin.classes.serializers import FormSerializer

from shop.redis_cache_class import QuerysetCache


class BasicManager:
    _registered_models: dict[models.Model, ModelAdmin]
    _redis_cache: QuerysetCache

    def __init__(self, registered_models: dict[models.Model, ModelAdmin], redis_cache: QuerysetCache):
        self._registered_models = registered_models
        self._redis_cache = redis_cache


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


class FormModelManager(BasicManager):
    form_serializer_class = FormSerializer
    form_renderer_class = FormRenderer

    def __init__(self, registered_models: dict[models.Model, ModelAdmin], redis_cache: QuerysetCache):
        super().__init__(registered_models, redis_cache)

    def get_form_for_model_instance(self, model: models.Model, instance=None):
        form_class = self.get_model_form_class_by_model(model)

        form = form_class(instance=instance) if instance else form_class()

        return form

    def get_model_form_class_by_model(self, model_to_form: models.Model) -> ModelForm:
        class Meta:
            model = model_to_form
            fields = '__all__'

        return type(f'{model_to_form.__name__}Form', (ModelForm,), {"Meta": Meta})

    def get_rendered_form_data(self, model, instance=None) -> dict:
        form = self.get_form_for_model_instance(model, instance)

        form = self.form_serializer_class(form).data

       # rendered_form = self.form_renderer_class(form).render()

        return form

    def get_rendered_form_html(self, model, instance=None):
        form = self.get_form_for_model_instance(model, instance)

        html_result_list = []

        for field_name, field in form.fields.items():
            value_for_input = getattr(
                instance, field_name) if instance else None

            html_result_list.append(
                field.widget.render(field_name, value_for_input))

        return html_result_list


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

    def run_filter(self, model: models.Model, query_string: str):

        encoded_query_string = urllib.parse.unquote_plus(
            query_string.strip("?"))

        query_params = dict((encoded_query_string.split("="),))

        queryset = self._redis_cache.get(model.objects.filter(**query_params))

        return queryset

    def set_related_choices(self, field, filter_data: dict) -> dict:
        filter_data = filter_data.copy()

        filter_data['choices'] = [
            {'display': str(obj), 'value': obj.pk}
            for obj in field.related_model.objects.all()
        ]

        return filter_data
