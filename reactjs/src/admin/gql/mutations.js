import { gql } from "@apollo/client";


export const CREATE_MODEL_INSTANCE = gql`
  mutation CreateModelInstance($appName: String!, $modelName: String!, 
                                  $formValues: String!, $files:Upload){

    createModelInstance(appName:$appName,modelName:$modelName,
                     formValues:$formValues,files:$files){

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


export const UPDATE_MODEL_INSTANCE = gql`
  mutation UpdateModelInstance($appName: String!, $modelName: String!, 
                                  $instanceId: Int!, $formValues: String!, $files:Upload){

    updateModelInstance(appName:$appName,modelName:$modelName,
                      instanceId:$instanceId,formValues:$formValues,files:$files){

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
