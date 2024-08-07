import requests
import json

HOST = "https://countriesnow.space/"

STATES_BY_COUNTRY_URL = "api/v0.1/countries/states"

CITIES_BY_STATE_URL = "api/v0.1/countries/state/cities"

from requests.exceptions import HTTPError


# def check_for_server_status(url):
#     try:
#         response = requests.get(url)
#         response.raise_for_status()
#     except HTTPError as http_err:
#         print(f"HTTP error occurred: {http_err}")
#         raise http_err
#     except Exception as err:
#         print(f"Other error occurred: {err}")
#         raise err
#     else:
#         return True


def get_states_by_country(country: str, *args, **kwargs) -> tuple[str]:
    '''Get tuple of states/provinces in specific country by name'''
    request_parameters = {"country": country}
    
    response  = requests.post(HOST+STATES_BY_COUNTRY_URL,request_parameters)

    response_data = json.loads(response.text)['data']

    states = create_tuple_of_states(response_data['states'])

    return states


def create_tuple_of_states(states: list) -> tuple[str]:
    '''Transform list of state's dictionaries into tuple of only state names'''
    return tuple(item.get('name') for item in states)
 

def get_cities_by_country_state(country: str, state:str, *args, **kwargs) -> tuple[str]:
    '''Get tuple of cities in state + country by name'''
    request_parameters = {"country": country, "state": state} 

    response  = requests.post(HOST+CITIES_BY_STATE_URL,request_parameters)

    response = json.loads(response.text)
    
    return tuple(response['data'])
 