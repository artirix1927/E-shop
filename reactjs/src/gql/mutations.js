
import { gql } from "@apollo/client";

export const LOGIN_USER = gql`
  mutation LoginUser($username: String!, $password: String!) {
    loginUser(username: $username, password: $password) {
      user {
        id
        username
        email
      }
    }
  }
`;


export const CREATE_USER = gql`
  mutation CreateUser($username: String!, $password: String!, $email: String!) {
    createUser(username: $username, password: $password, email:$email) {
      user {
        id
        username
        email
      }
    }
  }
`;

export const LOGOUT_USER = gql`
  mutation LogoutUser{
    logoutUser{
      success
    }
  }
`



export const ADD_TO_CART = gql`
  mutation Cart($userId: Int!, $productId: Int!, $quantity: Int!){
    addToCart(userId: $userId, productId: $productId, quantity: $quantity){
      success
    }
  }
`


export const CHANGE_CART_ITEM_QUANTITY = gql`
  mutation ChangeCartItemQuantity($id: Int!, $quantity: Int!){
    changeCartItemQuantity(id: $id, quantity: $quantity){
      success
    }
  }
`

export const DELETE_FROM_CART = gql`
  mutation DeleteFromCart($id: Int!){
    deleteFromCart(id: $id){
      success
    }
  }
`


export const CREATE_ORDER = gql`
  mutation CreateOrder($country: String!, $state: String!,  $fullName: String!, $phoneNumber: String!,
   $adress: String!, $city: String!, $postalCode: String!, $user: Int!, $items: String!){

    createOrder(country:$country, state: $state, fullName:$fullName, phoneNumber:$phoneNumber, 
    adress:$adress, city:$city, postalCode:$postalCode, user:$user, items:$items){
      success
    
    }
   }

`