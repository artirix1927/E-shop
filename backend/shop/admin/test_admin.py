import json
import pytest
from shop.test_utils import get_reponse_data
from shop.fixtures import client_query, first_product, phone_category


@pytest.mark.django_db
def test_all_apps(client_query):
    response = client_query('''query AllApps{
        allApps{
            appName

        }
        }''', operation_name="AllApps")

    assert 'errors' not in response


@pytest.mark.django_db
def test_model_instances(client_query):

    appName = "products"
    modelName = "Product"
    response = client_query('''query ModelInstances($appName: String!, $modelName:String!){
        modelInstances(appName:$appName, modelName:$modelName){
            modelName

            }
        }''',
                            operation_name="ModelInstances",
                            variables={"appName": appName, "modelName": modelName})

    assert 'errors' not in response
    assert get_reponse_data(response)["modelName"] == modelName


@pytest.mark.django_db
def test_model_create_form(client_query):

    appName = "products"
    modelName = "Product"
    response = client_query('''query ModelCreateForm($appName: String!, $modelName:String!){
        modelCreateForm(appName:$appName, modelName:$modelName){
            modelName

            }
        }''',
                            operation_name="ModelCreateForm",
                            variables={"appName": appName, "modelName": modelName})

    assert 'errors' not in response


@pytest.mark.django_db
def test_model_instance_form(client_query, first_product):

    appName = "products"
    modelName = "Product"
    id = first_product.id
    response = client_query('''query ModelInstanceForm($appName: String!, $modelName:String!, $id:Int!){
        modelInstanceForm(appName:$appName, modelName:$modelName, id:$id){
            modelName

            }
        }''',
                            operation_name="ModelCreateForm",
                            variables={"appName": appName, "modelName": modelName, "id": id})

    assert 'errors' not in response


@pytest.mark.django_db
def test_model_filters(client_query):

    appName = "products"
    modelName = "Product"
    response = client_query('''query ModelFilters($appName: String!, $modelName:String!){
        modelFilters(appName:$appName, modelName:$modelName){
            filtersData

            }
        }''',
                            operation_name="ModelFilters",
                            variables={"appName": appName, "modelName": modelName})

    assert 'errors' not in response


@pytest.mark.django_db
def test_model_run_filter(client_query):

    appName = "products"
    modelName = "Product"
    query_string = '?category__id__exact=1'
    response = client_query('''query RunFilter($appName: String!, $modelName:String!, $queryString: String!){
        runFilter(appName:$appName, modelName:$modelName, queryString: $queryString){
            

            }
        }''',
                            operation_name="ModelFilters",
                            variables={"appName": appName, "modelName": modelName, "queryString": query_string})

    assert 'errors' not in response


@pytest.mark.django_db
def test_delete_instance(client_query, first_product):

    appName = "products"
    modelName = "Product"
    query_string = json.dumps([first_product.id])
    response = client_query('''mutation DeleteInstances($appName: String!, $modelName:String!, $instances: String!){
        deleteInstances(appName:$appName, modelName:$modelName, instances: $instances){
            success
        }
        }''',
                            operation_name="DeleteInstances",
                            variables={"appName": appName, "modelName": modelName, "queryString": query_string})

    assert 'errors' not in response


@pytest.mark.django_db
def test_create_instance(client_query, phone_category):

    appName = "products"
    modelName = "Product"
    form_values = json.dumps({"name": "Ihone 1123", "description": "123",
                             "price": 2000, "pieces_left": 2, "category": phone_category.id})
    response = client_query('''mutation DeleteInstances($appName: String!, $modelName:String!, $formValues: String!, $files: Upload!){
        deleteInstances(appName:$appName, modelName:$modelName, formValues: $formValues, files:$files){
            success
        }
        }''',
                            operation_name="DeleteInstances",
                            variables={"appName": appName, "modelName": modelName, "formValues": form_values})

    assert 'errors' not in response


@pytest.mark.django_db
def test_update_instance(client_query, phone_category, first_product):

    appName = "products"
    modelName = "Product"
    instance_id = first_product.id
    form_values = json.dumps({"name": "Ihone 1123", "description": "123",
                             "price": 2000, "pieces_left": 2, "category": phone_category.id})

    response = client_query('''mutation UpdateInstance($appName: String!, $modelName:String!, $instanceId:Int! $formValues: String!, $files: Upload!){
        updateInstance(appName:$appName, modelName:$modelName, instanceId: $instanceId, formValues: $formValues, files:$files){
            success
        }
        }''',
                            operation_name="DeleteInstances",
                            variables={"appName": appName, "modelName": modelName, "formValues": form_values, "instanceId": instance_id})

    assert 'errors' not in response
