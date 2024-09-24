from graphene_django.utils.testing import GraphQLTestCase


class LoginTests(GraphQLTestCase):
    def test_create_user(self,
                         variables=dict({"username": "volleyy11",
                                         "password": "admin2281337",
                                         "email": "gg@gmail.com"})):
        operation_name = "CreateUser"
        operation_variables = variables
        response = self.query(
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
        self.assertResponseNoErrors(response)

    def setUp(self):
        super().setUp()
        self.test_create_user(
            variables={
                "username": "testuser",
                "password": "user",
                "email": "gg@gmail.com"})

    def test_login_user(self):
        operation_name = "LoginUser"
        operation_variables = {"username": "testuser", "password": "user"}

        response = self.query(
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

        self.assertResponseNoErrors(response)
