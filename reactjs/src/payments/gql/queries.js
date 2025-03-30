import { gql } from "@apollo/client";



export const GET_PAYMENT_INTENT= gql`

query @api(name: app){
    paymentIntentData {
      paymentData
    }
  }
`;