import { gql } from "@apollo/client";


export const CREATE_ORDER = gql`
  mutation CreateOrder($country: String!, $state: String!,  $fullName: String!, $phoneNumber: String!,
   $adress: String!, $city: String!, $postalCode: String!, $user: Int!, $items: String!){

    createOrder(country:$country, state: $state, fullName:$fullName, phoneNumber:$phoneNumber, 
    adress:$adress, city:$city, postalCode:$postalCode, user:$user, items:$items){
      success
    
    }
   }

`