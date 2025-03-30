import { gql } from "@apollo/client";



export const SAVE_STRIPE_INFO= gql`

mutation SaveStripeInfo ($email: String!, $paymentMethodData: GenericScalar) @api(name: app){
    saveStripeInfo(email:$email, paymentMethodData:$paymentMethodData){
        success
    }
    
  }
`;