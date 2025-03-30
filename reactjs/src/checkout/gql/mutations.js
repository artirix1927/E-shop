import { gql } from "@apollo/client";


export const CREATE_CHECKOUT_SESSION = gql`
  mutation CreateCheckoutSession($user: Int!, $productId:Int, $quantity:Int, $items: String) @api(name: app){

    createCheckoutSession(user:$user, productId: $productId, quantity:$quantity, items:$items){
      checkoutUrl
    
    }
   }

`



export const CREATE_ORDER = gql`
  mutation CreateOrderAfterCheckout($country: String!, $state: String!,  $fullName: String!, $phoneNumber: String!,
   $adress: String!, $city: String!, $postalCode: String!, $user: Int!, $items: String,  $productId:Int, $quantity:Int, $buyNowOrder:Boolean!) @api(name: app){

    createOrderAfterCheckout(country:$country, state: $state, fullName:$fullName, phoneNumber:$phoneNumber, 
    adress:$adress, city:$city, postalCode:$postalCode, user:$user, items:$items, productId: $productId, quantity:$quantity, buyNowOrder:$buyNowOrder){
      success
    
    }
   }

`
