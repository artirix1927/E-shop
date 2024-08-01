
import { gql } from "@apollo/client";

export const LOGIN_USER = gql`
  mutation LoginUser($username: String!, $password: String!) {
    loginUser(username: $username, password: $password) {
      user {
        id
        username
        email
        isStaff
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
      cartItem{
        id
      }
    }
  }
`


export const CHANGE_CART_ITEM_QUANTITY = gql`
  mutation ChangeCartItemQuantity($id: Int!, $quantity: Int!){
    changeCartItemQuantity(id: $id, quantity: $quantity){
      cartItem{
        id
      }
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


export const CLOSE_TICKET = gql`
  mutation CloseTicket($ticketId: Int!){
    closeTicket(ticketId:$ticketId){
      ticket{
        closed
      }
    }
  }
`


export const UPDATE_MODEL_INSTANCE = gql`
  mutation UpdateModelInstance($appName: String!, $modelName: String!, 
                                  $instanceId: Int!, $formValues: String!, $files:Upload){

    updateModelInstance(appName:$appName,modelName:$modelName,
                      instanceId:$instanceId,formValues:$formValues,files:$files){

      success

    }
  }


`


export const DELETE_INSTANCES = gql`
mutation DeleteInstances($appName: String!, $modelName: String!, 
                                  $instances: String!){

    deleteInstances(appName:$appName,modelName:$modelName,
                      instances:$instances){

      success

    }
  }

`


export const CREATE_MODEL_INSTANCE = gql`
  mutation CreateModelInstance($appName: String!, $modelName: String!, 
                                  $formValues: String!, $files:Upload){

    createModelInstance(appName:$appName,modelName:$modelName,
                     formValues:$formValues,files:$files){

      success

    }
  }


`