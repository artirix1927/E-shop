import { gql } from "@apollo/client";


export const GET_AVAILABLE_COUNTRIES = gql`
  query @api(name: app){
    availableCountries{
      name
    }
  }
`

export const GET_STATES_BY_COUNTRY = gql`
  query StatesByCountry($country: String!) @api(name: app){
    statesByCountry(country:$country){
      name
    }
  }
`

export const GET_CITIES_BY_COUNTRY_STATE = gql`
  query CitiesByCountryState($country: String!, $state:String!) @api(name: app){
    citiesByCountryState(country:$country, state:$state){
      name
    }
  }

`