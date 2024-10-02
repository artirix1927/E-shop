from abc import ABC, abstractmethod
from typing import Iterable

from django.db import models
from django.db.models.base import ModelBase

from admin.classes.register_model import RegisterAdminModel


class CheckChainInterface(ABC):
    '''Interface for Chain of responsibilty 
    for validating model registration in admin'''

    @abstractmethod
    def check(self):
        pass


class BaseCheck(CheckChainInterface):
    '''Base Class for Check class with initialization and intsance attrs'''
    registered_models: list[RegisterAdminModel]
    model_admin_class: RegisterAdminModel

    fields_to_check: set
    model_or_iterable: models.Model | Iterable[models.Model]

    def __init__(self, registered_models: list[RegisterAdminModel], model_admin_class: RegisterAdminModel, model_or_iterable: models.Model):
        self.registered_models = registered_models
        self.model_admin_class = model_admin_class

        self.fields_to_check = vars(model_admin_class)
        self.model_or_iterable = model_or_iterable

    def get_models_to_check(self) -> list[models.Model]:
        '''if registered one model returns list of one model, 
        if registered iterable of models then returns the iterable'''

        models_to_check = self.model_or_iterable

        if not self.check_if_iterable():
            models_to_check = [self.model_or_iterable]

        return models_to_check

    def check_if_iterable(self) -> bool:
        '''checks if the registered model is iterable of models or one model'''
        if isinstance(self.model_or_iterable, ModelBase):
            return False

        return True
