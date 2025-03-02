# from django.db.models import Model
from django.db import models

# from admin.classes.check_chain import BasicAdminChecksChain
# from admin.classes.forms_classes import FormRenderer, FormSerializer
# from django.core.serializers.json import DjangoJSONEncoder

from admin.classes.managers import AppModelManager, FilterModelManager, FormModelManager
from admin.classes.managers.search_model_manager import SearchModelManager
from shop.cache_class import QuerysetCache


from django.db.models.base import ModelBase

from django.contrib import admin
from django.contrib.admin import ModelAdmin

# import django.forms.widgets


class Admin:
    __admin_instance = None

    __redis_cache: QuerysetCache
    __registered_models: dict[models.Model, ModelAdmin]
    # __checks_chain:

    apps: AppModelManager
    forms: FormModelManager
    filters: FilterModelManager
    search = SearchModelManager

    def __init__(self, redis_cache: QuerysetCache):
        self.__admin_instance = self
        self.__registered_models = admin.site._registry
        self.__redis_cache = redis_cache

        self.apps = AppModelManager(
            self.__registered_models, self.__redis_cache)

        self.forms = FormModelManager(
            self.__registered_models, self.__redis_cache)

        self.filters = FilterModelManager(
            self.__registered_models, self.__redis_cache)

        self.search = SearchModelManager(
            self.__registered_models, self.__redis_cache)

        # self.__checks_chain = checks_chain

    @classmethod
    def get_class_instance(cls, redis_cache: QuerysetCache = None):
        if not cls.__admin_instance:
            cls.__admin_instance = cls(redis_cache)

        return cls.__admin_instance

    # def get_model_by_model_admin(self, model_admin: RegisterAdminModel):
    #     return self.__registered_models.get(model_admin)

    def register(self, model_or_iterable, model_admin_class: ModelAdmin):

        # it will run all its checks and will register to the main admin
        # if something is wrong it will throw exception

        admin.site.register(model_or_iterable, model_admin_class)

        if isinstance(model_or_iterable, ModelBase):
            model_or_iterable = [model_or_iterable]

        # for model in model_or_iterable:
        #     if model._meta.abstract:
        #         raise ImproperlyConfigured

        # passing the admin site param beacuse the
        # model admin class need it for __init__
        for model in model_or_iterable:
            self.__registered_models[model] = model_admin_class(
                model, admin.site)

        # self.__checks_chain.run_checks(
        #     self.__registered_models,  model_admin_class, model_or_iterable)


# class AdminModelRegisterChecks:
#     model: RegisterAdminModel
#     model_admin_class: RegisterAdminModel
#     registered_models: list[RegisterAdminModel]
#     fields_to_check: set
#     Meta: type

#     def __init__(self, model_admin: RegisterAdminModel, model_admin_class: RegisterAdminModel, registered_models: list[RegisterAdminModel]) -> None:
#         self.model = model_admin.model
#         self.model_admin_class = model_admin_class
#         self.registered_models = registered_models
#         self.fields_to_check = model_admin.__dict__.items()
