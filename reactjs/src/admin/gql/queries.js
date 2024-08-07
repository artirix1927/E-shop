import { gql } from "@apollo/client";


export const GET_ADMIN_APPS = gql`
  query{
    allApps{
      appName
      models
    }
  }

`

export const GET_MODEL_INSTANCE_FORM = gql`
  query ModelInstanceForm($appName: String!, $modelName: String!, $id: Int!){
    modelInstanceForm(appName:$appName, modelName:$modelName, id:$id){
      modelName
      form
    }
}
`

export const GET_MODEL_CREATE_FORM = gql`
  query ModelCreateForm($appName: String!, $modelName: String!){
    modelCreateForm(appName:$appName, modelName:$modelName){
      modelName
      form
    }
}
`


export const GET_MODEL_INSTANCES = gql`
  query ModelInstances($appName: String!, $modelName: String!){
    modelInstances(appName:$appName, modelName:$modelName){
      instances
    }
}
`


export const GET_SUPPORT_TICKETS = gql`
  query AllTickets($offset: Int!, $limit: Int!){
    allTickets(offset: $offset, limit: $limit){
      id
      closed
      user{
        username
      }
    }
  
  }
`



export const GET_SUPPORT_TICKET_MESSAGES = gql`
  query MessagesByTicket($id: Int!, $offset: Int!, $limit: Int!){
    getMessagesByTicket(id: $id, offset: $offset, limit: $limit){
      id
      message
      sentBy{
        id
        username
      }
      
    }
}
`


