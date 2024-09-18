import { gql } from "@apollo/client";

export const GET_ALL_REVIEWS = gql`

query @api(name: app){
    allReviews { 
        stars
        text 
        user{
            username
        }

        attachments{
            image
        }
    }
}


`