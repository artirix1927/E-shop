import { gql } from "@apollo/client";


export const CREATE_ORDER_FROM_CART = gql`
  mutation CreateOrderFromCart($country: String!, $state: String!,  $fullName: String!, $phoneNumber: String!,
   $adress: String!, $city: String!, $postalCode: String!, $user: Int!, $items: String!) @api(name: app){

    createOrderFromCart(country:$country, state: $state, fullName:$fullName, phoneNumber:$phoneNumber, 
    adress:$adress, city:$city, postalCode:$postalCode, user:$user, items:$items){
      success
    
    }
   }

`



export const CREATE_BUY_NOW_ORDER = gql`
  mutation CreateBuyNowOrder($country: String!, $state: String!,  $fullName: String!, $phoneNumber: String!,
   $adress: String!, $city: String!, $postalCode: String!, $user: Int!, $productId:Int!, $quantity:Int!) @api(name: app){

    createBuyNowOrder(country:$country, state: $state, fullName:$fullName, phoneNumber:$phoneNumber, 
    adress:$adress, city:$city, postalCode:$postalCode, user:$user, productId: $productId, quantity:$quantity){
      success
    
    }
   }

`


