import { gql } from "@apollo/client";


export const GET_PRODUCT_BY_ID = gql`
    query Product($id: Int!) @api(name: app){
        productById(id:$id){
            name
            description
            weight
            piecesLeft
            price
            attachments{
                image
            }

            characteristics{
              characteristic{name}
              value
            }   
        }
    }
`