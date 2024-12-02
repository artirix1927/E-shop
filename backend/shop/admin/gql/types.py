from django.apps import apps

import graphene


class ModelInstanceType(graphene.ObjectType):
    model_name = graphene.String()
    instances = graphene.JSONString()


class AppType(graphene.ObjectType):
    app_name = graphene.String()
    models = graphene.List(graphene.String)

    def resolve_models(self, info):
        return [model.__name__ for model in self.models]


class ModelInstanceFormType(graphene.ObjectType):
    app_name = graphene.String()
    model_name = graphene.String()
    instance_id = graphene.Int()
    form = graphene.String()


class ModelCreateFormType(graphene.ObjectType):
    app_name = graphene.String()
    model_name = graphene.String()
    form = graphene.String()


class ModelFiltersType(graphene.ObjectType):
    app_name = graphene.String()
    model_name = graphene.String()
    filters_data = graphene.String()
