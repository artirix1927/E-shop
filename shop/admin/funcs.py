from django.conf import settings

import json

def get_apps_with_models(apps):
    return [app for app in apps if list(app.get_models())]
   

def exclude_apps(apps):
    result = []
    for app in apps:
        if  get_app_name_without_dots(app.name) not in settings.EXCLUDE_FROM_ADMIN:
            result.append(app)
    return result



def get_app_name_without_dots(app_name:str) -> str:
    app_split = app_name.split('.')
    return app_split[-1]


def app_already_in_the_list(app_list, app_name):
    for app in app_list:
        if app.app_name == app_name:
            return True
    return False


def is_jsonable(x):
    try:
        json.dumps(x)
        return True
    except (TypeError, OverflowError):
        return False
