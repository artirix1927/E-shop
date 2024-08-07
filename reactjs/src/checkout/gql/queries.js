import { gql } from "@apollo/client";


export const GET_AVAILABLE_COUNTRIES = gql`
  query {
    availableCountries{
      name
    }
  }
`

export const GET_STATES_BY_COUNTRY = gql`
  query StatesByCountry($country: String!){
    statesByCountry(country:$country){
      name
    }
  }
`

export const GET_CITIES_BY_COUNTRY_STATE = gql`
  query CitiesByCountryState($country: String!, $state:String!){
    citiesByCountryState(country:$country, state:$state){
      name
    }
  }

`