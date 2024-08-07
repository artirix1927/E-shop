import { gql } from "@apollo/client";



export const GET_CART_BY_USER = gql`
    query CartById($id: Int!){
        cartByUser(id:$id){
            product{
              id
              name
              piecesLeft
              price
              attachments{
                image
              }
            }
            id
            quantity
        }
    }
`
