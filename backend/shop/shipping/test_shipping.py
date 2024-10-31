import pytest

from shop.test_utils import get_reponse_data


from shop.fixtures import client_query, two_countries


@pytest.mark.django_db
def test_available_countries(client_query, two_countries):
    response = client_query('''
    query{
        availableCountries{
            name
        }
    }

    ''')
    assert 'errors' not in response

    resp_data = get_reponse_data(response)

    assert resp_data == [{'name': 'Canada'}, {'name': 'United States'}]


@pytest.mark.django_db
def test_states_by_country(client_query, two_countries):
    operation_name = "StatesByCountry"
    operation_variables = {"country": "Canada"}

    response = client_query('''
    query StatesByCountry($country: String!){
        statesByCountry(country:$country){
            name
        }
    }
    ''',
                            operation_name=operation_name,
                            variables=operation_variables)

    assert 'errors' not in response


@pytest.mark.django_db
def test_cities_by_country_state(client_query, two_countries):
    operation_name = "CitiesByCountryState"
    operation_variables = {"country": "Canada", "state": "Ontario"}

    response = client_query('''
    query CitiesByCountryState($country: String!, $state:String!){
        citiesByCountryState(country:$country, state:$state){
            name
        }
    }
    ''',
                            operation_name=operation_name,
                            variables=operation_variables)

    assert 'errors' not in response
