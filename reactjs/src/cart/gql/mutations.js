import { gql } from "@apollo/client";


export const CHANGE_CART_ITEM_QUANTITY = gql`
  mutation ChangeCartItemQuantity($id: Int!, $quantity: Int!) @api(name: app){
    changeCartItemQuantity(id: $id, quantity: $quantity){
      cartItem{
        id
      }
    }
  }
`



export const DELETE_FROM_CART = gql`
  mutation DeleteFromCart($id: Int!) @api(name: app){
    deleteFromCart(id: $id){
      success
    }
  }
`