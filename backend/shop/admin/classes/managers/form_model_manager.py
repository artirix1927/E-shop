from django.contrib.auth import get_user_model
from django.contrib.auth.forms import UserCreationForm, UserChangeForm

from django.db import models
from django.contrib.admin import ModelAdmin
from django.forms import ModelForm
from pytest import console_main


from admin.classes.renderers import FormRenderer
from admin.classes.serializers import FormSerializer

from admin.classes.managers.base import BasicManager
from shop.cache_class import QuerysetCache

User = get_user_model()  # Get the current User model


class FormModelManager(BasicManager):
    form_serializer_class = FormSerializer
    form_renderer_class = FormRenderer

    def __init__(self, registered_models: dict[models.Model, ModelAdmin], redis_cache: QuerysetCache):
        super().__init__(registered_models, redis_cache)

    def get_form_for_model_instance(self, model: models.Model, instance=None):
        if model == User:
            if instance:
                return UserChangeForm(instance=instance)
            return UserCreationForm()

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
