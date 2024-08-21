import { gql } from "@apollo/client";

export const GET_ALL_REVIEWS = gql`

query{
    allReviews{ 
        stars
        text 
        user{
            username
        }    
    }
}


`