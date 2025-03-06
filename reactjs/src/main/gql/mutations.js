import { gql } from "@apollo/client";

export const ADD_TO_CART = gql`
  mutation Cart($userId: Int!, $productId: Int!, $quantity: Int!) @api(name: app){
    addToCart(userId: $userId, productId: $productId, quantity: $quantity){
      cartItem{
        id
      }
    }
  }
`

export const CREATE_TICKET = gql`
  mutation CreateTicket($userId: Int!) @api(name: chat) {
    createTicket(userId: $userId){
      ticket{
        user{
          id
        }
      }
    }
    
}
`