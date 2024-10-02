from admin.classes.chain_base import BaseCheck
from typing import Iterable


from django.db import models

import django.contrib.admin.exceptions as admin_exceptions
from django.core.exceptions import FieldDoesNotExist

from admin.classes.register_model import RegisterAdminModel

# from admin.classes.admin_reg import ModelAdmin


class CheckModelAdminListedFieldsExist(BaseCheck):

    '''Checks that all model fields (for example,'fields','exclude','readonly') 
    listed in modelAdmin class exist'''

    def check(self):
        self.check_model_admin_listed_fields_exist()

    def check_model_admin_listed_fields_exist(self) -> None:
        '''reading all modelAdmin fieldsets and checks that model fields listed there exist'''
        for _, values in self.fields_to_check.items():
            if isinstance(values, tuple) or isinstance(values, list):
                self.check_fields_exist_in_a_model(values)

    def check_fields_exist_in_a_model(self, fields: Iterable) -> None:
        '''checking if all fields listed in one modelAdmin fieldset exist'''
        for field in fields:
            self.model_field_exists(field)

    def model_field_exists(self, field: str) -> bool | Exception:
        '''checks that one specific field exist in a model'''
        
        models_to_check = self.get_models_to_check()
        
        try:
            for model in models_to_check:
                model._meta.get_field(field)
            return True

        except FieldDoesNotExist as e:
            raise e


class CheckModelNotRegistered(BaseCheck):
    '''checks that model admin class is not already registered'''

    def check(self):
        self.check_model_not_exists()

    def check_model_not_exists(self):
        models_to_check = self.get_models_to_check()

        for model in models_to_check:
            if model in self.registered_models:
                raise admin_exceptions.AlreadyExists


class BasicAdminChecksChain:
    chain: list[BaseCheck] = [CheckModelNotRegistered,
                              CheckModelAdminListedFieldsExist]

    @classmethod
    def run_checks(cls, registered_models: list[RegisterAdminModel], model_admin_class: RegisterAdminModel, model_or_iterable: models.Model):
        for check_class in cls.chain:
            check_class(model_admin_class, registered_models,
                        model_or_iterable).check()
