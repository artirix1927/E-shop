# from django.db.models import Model
from django.db import models
from django.forms import ModelForm

from admin.classes.serializers import FormSerializer
from shop.redis_cache_class import QuerysetCache


class RegisterAdminModel:
    _redis_cache = QuerysetCache("admin")

    fields: list | tuple
    readonly_fields:  list | tuple
    exclude_fields:  list | tuple
    filters: list | tuple
    model: models.Model

    def __init__(self, model: models.Model):
        self.model = model

    def get_instances_queryset_by_model(self) -> models.QuerySet:
        query = self.model.objects.all().order_by('id')
        queryset = self._redis_cache.get(query)

        return queryset

    def get_model_form_class_by_model(self) -> ModelForm:

        class Meta:
            model = self.model
            fields = '__all__'

        return type(f'{self.model.__name__}Form', (ModelForm,), {"Meta": Meta})

    def resolve_model_instance_form(self, id: int):

        picked_model = self.model
        instance = picked_model.objects.get(id=id)

        form_class = self.get_model_form_class_by_model(picked_model)

        form = form_class(instance=instance)

        form = FormSerializer(form).data

        return form
