import pytest
from shop.test_utils import get_reponse_data
from shop.fixtures import client_query, user


@pytest.mark.django_db
def test_create_user(client_query,
                     variables=dict({"username": "volleyy11",
                                     "password": "admin2281337",
                                     "email": "gg@gmail.com"})):
    operation_name = "CreateUser"
    operation_variables = variables
    response = client_query(
        '''
    mutation CreateUser($username: String!, $password: String!, $email:String!){
        createUser(username:$username, password:$password,email:$email){
            user{
                username
            }
        }
    }
    ''',
        operation_name=operation_name,
        variables=operation_variables,
    )
    assert 'errors' not in response
# def setUp(self):
#     super().setUp()
#     self.test_create_user(
#         variables={
#             "username": "testuser",
#             "password": "user",
#             "email": "gg@gmail.com"})


@pytest.mark.django_db
def test_login_user(client_query, user):
    operation_name = "LoginUser"
    operation_variables = {"username": "testuser", "password": "user"}

    response = client_query(
        '''
    mutation LoginUser($username: String!, $password: String!){
    loginUser(username:$username, password:$password){
            user{
                username
            }
        }
    }
    ''',

        operation_name=operation_name,
        variables=operation_variables
    )

    assert 'errors' not in response
