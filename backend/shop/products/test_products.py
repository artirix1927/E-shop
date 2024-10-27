import pytest

from shop.test_utils import get_reponse_data
from shop.fixtures import first_product, second_product, client_query, phone_category, accessory_category


@pytest.mark.django_db
def test_get_all_categories(client_query, phone_category, accessory_category):
    response = client_query('''
    query{
        allCategories{
            name
        }
    }
    ''',
                            )

    assert 'errors' not in response

    resp_data = get_reponse_data(response)

    assert resp_data == [{"name": "Phones"}, {"name": "Accessories"}]


@pytest.mark.django_db
def test_all_products(client_query, first_product, second_product):
    operation_name = "AllProducts"
    operation_variables = {"offset": 0, "limit": 10}

    response = client_query('''
    query AllProducts($offset:Int!, $limit:Int!){

            allProducts(offset:$offset, limit:$limit){
                name
            }

    }
    ''',
                            operation_name=operation_name,
                            variables=operation_variables,
                            )
    assert 'errors' not in response

    resp_data = get_reponse_data(response)

    assert resp_data == [{'name': 'Iphone 15'}, {'name': 'Iphone 15 case'}]


@pytest.mark.django_db
def test_product_by_id(client_query, first_product, second_product):
    operation_name = "ProductById"
    operation_variables = {"id": 1}

    response = client_query('''
    query ProductById($id: Int!){
        productById(id:$id){
            name
        }
    }
    ''',
                            operation_name=operation_name,
                            variables=operation_variables
                            )

    assert 'errors' not in response

    resp_data = get_reponse_data(response)
    assert resp_data == {'name': 'Iphone 15'}


@pytest.mark.django_db
def test_product_by_category(client_query, first_product, second_product):
    operation_name = "ProductsByCategory"
    operation_variables = {"category": "Phones", "offset": 0, "limit": 10}

    response = client_query('''
    query ProductsByCategory($category: String!, $offset:Int!, $limit:Int!){
        productsByCategory(category:$category, offset:$offset, limit:$limit){
            name
        }
    }
    ''',
                            operation_name=operation_name,
                            variables=operation_variables
                            )

    assert 'errors' not in response
    resp_data = get_reponse_data(response)
    assert resp_data == [{'name': 'Iphone 15'}]


@pytest.mark.django_db
def test_products_by_search_with_category(client_query, first_product, second_product):
    operation_name = "ProductsBySearch"
    operation_variables = {
        "category": "Phones",
        "search": "15",
        "offset": 0,
        "limit": 10}

    response = client_query(
        '''
    query ProductsBySearch($category: String!, $search:String!, $offset:Int!, $limit:Int!){
        productsBySearch(category:$category, search:$search, offset:$offset, limit:$limit){
            name
        }
    }
    ''',
        operation_name=operation_name,
        variables=operation_variables
    )

    assert 'errors' not in response

    resp_data = get_reponse_data(response)
    assert resp_data == [{'name': 'Iphone 15'}]


@pytest.mark.django_db
def test_products_by_search_without_category(client_query, first_product, second_product):
    operation_name = "ProductsBySearch"
    operation_variables = {
        "category": "all",
        "search": "15",
        "offset": 0,
        "limit": 10}
    response = client_query('''
    query ProductsBySearch($category: String!, $search:String!, $offset:Int!, $limit:Int!){
        productsBySearch(category:$category, search:$search, offset:$offset, limit:$limit){
            name
        }
    }
    ''',
                            operation_name=operation_name,
                            variables=operation_variables
                            )

    resp_data = get_reponse_data(response)
    assert 'errors' not in response
    assert resp_data == [{'name': 'Iphone 15'},
                         {'name': 'Iphone 15 case'}]
