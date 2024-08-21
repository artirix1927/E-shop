import requests
import json


class CountriesApi:
    
    HOST = "https://countriesnow.space/"
    STATES_BY_COUNTRY_URL = "api/v0.1/countries/states"
    CITIES_BY_STATE_URL = "api/v0.1/countries/state/cities"


    def get_states_by_country(self, country: str, *args, **kwargs) -> tuple[str]:
        '''Get tuple of states/provinces in specific country by name'''
        request_parameters = {"country": country}
        
        response  = requests.post(self.HOST+self.STATES_BY_COUNTRY_URL,request_parameters)

        response_data = json.loads(response.text)['data']

        states = self.create_tuple_of_states(response_data['states'])

        return states


    def create_tuple_of_states(self,states: list) -> tuple[str]:
        '''Transform list of state's dictionaries into tuple of only state names'''
        return tuple(item.get('name') for item in states)
    

    def get_cities_by_country_state(self, country: str, state:str, *args, **kwargs) -> tuple[str]:
        '''Get tuple of cities in state + country by name'''
        request_parameters = {"country": country, "state": state} 

        response  = requests.post(self.HOST+self.CITIES_BY_STATE_URL,request_parameters)

        response = json.loads(response.text)
        
        return tuple(response['data'])
 