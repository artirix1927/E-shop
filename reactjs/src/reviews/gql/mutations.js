

import { gql } from "@apollo/client"

export const CREATE_REVIEW = gql`
    mutation CreateReview($userId: Int!, $stars:Int!, $text:String!, $productId: Int!, $files: Upload!) @api(name: app){
        createReview(userId: $userId, stars:$stars, text:$text, productId: $productId, files: $files){
        
            success
        
        }
    
    }

`