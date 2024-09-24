from typing import Any
from django.conf import settings

import json

from django.apps import apps, AppConfig

from django.db.models import Model

from django.forms import ModelForm

from django.utils.datastructures import MultiValueDict


def get_apps_with_models(apps: list[AppConfig]) -> list[AppConfig]:
    return [app for app in apps if list(app.get_models())]


def exclude_apps_from_settings(apps: list[AppConfig]) -> list[str]:
    result = []
    for app in apps:
        if get_app_name_without_dots(
                app.name) not in settings.EXCLUDE_FROM_ADMIN:
            result.append(app)
    return result


def get_app_name_without_dots(app_name: str) -> str:
    app_split = app_name.split('.')
    return app_split[-1]


def is_jsonable(x: Any) -> bool:
    try:
        json.dumps(x)
        return True
    except (TypeError, OverflowError):
        return False


def get_model_by_app_and_name(app_name: str, model_name: str) -> Model:
    app_config = apps.get_app_config(app_name)
    model = app_config.get_model(model_name)

    return model


def get_model_form_class_by_model(picked_model: Model):

    class Meta:
        model = picked_model
        fields = '__all__'

    return type(f'{picked_model.__name__}Form', (ModelForm,), {"Meta": Meta})


def create_multivalue_dict_for_files(files: list[dict]) -> MultiValueDict:
    files_multidict = MultiValueDict()
    for file_field in files:

        files_multidict.appendlist(file_field['name'], file_field['file'])

    return files_multidict
