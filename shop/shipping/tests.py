from shipping.models import AvailableCountries
from graphene_django.utils.testing import GraphQLTestCase

from shop.test_utils import get_reponse_data

class ShippingTests(GraphQLTestCase):
    def setUp(self):
        super().setUp()
        AvailableCountries.objects.create(name="Canada")
        AvailableCountries.objects.create(name="United States")



    def test_available_countries(self):
        response = self.query('''
        query{
            availableCountries{
                name
            }
        }

        ''')
        self.assertResponseNoErrors(response)
        
        resp_data = get_reponse_data(response)

        self.assertEqual(resp_data, [{'name': 'Canada'}, {'name': 'United States'}])


    def test_states_by_country(self):
        operation_name="StatesByCountry"
        operation_variables={"country":"Canada"}

        response = self.query('''
        query StatesByCountry($country: String!){
            statesByCountry(country:$country){
                name
            }
        }
        ''',
        operation_name=operation_name,
        variables=operation_variables)

        self.assertResponseNoErrors(response)


    def test_cities_by_country_state(self):
        operation_name="CitiesByCountryState"
        operation_variables={"country":"Canada", "state":"Ontario"}

        response = self.query('''
        query CitiesByCountryState($country: String!, $state:String!){
            citiesByCountryState(country:$country, state:$state){
                name
            }
        }
        ''',
        operation_name=operation_name,
        variables=operation_variables)

        self.assertResponseNoErrors(response)
