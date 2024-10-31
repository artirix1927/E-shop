from graphene_django.utils.testing import GraphQLTestCase
import pytest

from shop.test_utils import get_reponse_data, create_product_examples
import json

from django.contrib.auth.models import User

from .models import CartItem

from shop.fixtures import first_product, second_product, client_query, \
    phone_category, accessory_category, user, first_cart_item, second_cart_item


@pytest.mark.django_db
def test_add_to_cart(client_query, user, first_product, second_product, first_cart_item):
    query = '''
    mutation AddToCart($userId: Int!, $productId: Int!, $quantity: Int!){
        addToCart(userId:$userId, productId:$productId, quantity:$quantity){
            cartItem{
                quantity
            }
        }
    }
    '''
    operation_name = "AddToCart"
    operation_variables = {"userId": 1, "productId": 1, "quantity": 1}

    response = client_query(query,
                            operation_name=operation_name,
                            variables=operation_variables,
                            )

    assert 'errors' not in response

    response_data = get_reponse_data(response)
    print(response_data)
    assert response_data.get('cartItem') == {'quantity': 2}

    operation_variables = {"userId": 1, "productId": 1, "quantity": 3}

    response = client_query(query,
                            operation_name=operation_name,
                            variables=operation_variables,
                            )
    response_data = get_reponse_data(response)
    assert response_data.get('cartItem') == {'quantity': 5}


@pytest.mark.django_db
def test_change_item_cart_quantity(client_query, user, first_product, second_product, first_cart_item):

    operation_name = "ChangeItemCartQuantity"
    operation_variables = {"id": 1, "quantity": 10}
    response = client_query(
        '''
        mutation ChangeItemCartQuantity ($id:Int!, $quantity:Int!){
            changeCartItemQuantity(id:$id, quantity:$quantity){
                cartItem{
                    quantity
                }

            }
        }
        ''',
        operation_name=operation_name,
        variables=operation_variables
    )

    assert 'errors' not in response

    response_data = get_reponse_data(response)
    print(response_data, response)
    assert response_data.get("cartItem") == {"quantity": 10}


@pytest.mark.django_db
def test_cart_by_user(client_query, user, first_product, second_product, first_cart_item):
    operation_name = "CartByUser"
    operation_variables = {"id": 1}

    response = client_query('''
        query CartByUser($id: Int!){
            cartByUser(id:$id){
                id
            }
        }
        ''',
                            operation_name=operation_name,
                            variables=operation_variables)

    assert 'errors' not in response


@pytest.mark.django_db
def test_create_cart_order(client_query, user, first_product, second_product, first_cart_item):
    operation_name = "CreateOrder"
    operation_variables = {"fullName": "art",
                           "phoneNumber": "+972533302094",
                           "country": "Canada",
                           "adress": "marconi",
                           "city": "london",
                           "state": "ontario",
                           "postalCode": "n5y zxc",
                           "user": 1,
                           "items": json.dumps([1,
                                                ])}

    response = client_query('''
    mutation CreateOrder($fullName: String!, $phoneNumber: String!, $country: String!,
                            $adress: String!, $city: String!, $state: String!,
                            $postalCode: String!, $user:Int!, $items:String!){

        createOrderFromCart(fullName:$fullName, phoneNumber:$phoneNumber, country:$country,
                    adress:$adress,city:$city,state:$state, postalCode:$postalCode,
                    user:$user, items:$items)
                    {
                        success
                    }
    }

    ''', operation_name=operation_name, variables=operation_variables)

    assert 'errors' not in response


@pytest.mark.django_db
def test_create_buy_now_order(client_query, user, first_product):
    operation_name = "CreateBuyNowOrder"
    operation_variables = {
        "fullName": "art",
        "phoneNumber": "+972533302094",
        "country": "Canada",
        "adress": "marconi",
        "city": "london",
        "state": "ontario",
        "postalCode": "n5y zxc",
        "user": 1,
        "productId": 1,
        "quantity": 1}

    response = client_query('''
    mutation CreateBuyNowOrder($fullName: String!, $phoneNumber: String!, $country: String!,
                            $adress: String!, $city: String!, $state: String!,
                            $postalCode: String!, $user:Int!, $productId:Int!, $quantity:Int!){

        createBuyNowOrder(fullName:$fullName, phoneNumber:$phoneNumber, country:$country,
                    adress:$adress,city:$city,state:$state, postalCode:$postalCode,
                    user:$user, productId:$productId, quantity:$quantity)
                    {
                        success
                    }
    }

    ''', operation_name=operation_name, variables=operation_variables)

    assert 'errors' not in response
