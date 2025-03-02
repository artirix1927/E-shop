import { gql } from "@apollo/client";


export const GET_ADMIN_APPS = gql`
  query @api(name: app){
    allApps{
      appName
      models
    }
  }

`

export const GET_MODEL_INSTANCE_FORM = gql`
  query ModelInstanceForm($appName: String!, $modelName: String!, $id: Int!) @api(name: app){
    modelInstanceForm(appName:$appName, modelName:$modelName, id:$id){
      modelName
      form
    }
}
`

export const GET_MODEL_CREATE_FORM = gql`
  query ModelCreateForm($appName: String!, $modelName: String!) @api(name: app){
    modelCreateForm(appName:$appName, modelName:$modelName){
      modelName
      form
    }
}
`


export const GET_MODEL_INSTANCES = gql`
  query ModelInstances($appName: String!, $modelName: String!) @api(name: app){
    modelInstances(appName:$appName, modelName:$modelName){
      instances
    }
}
`


export const GET_MODEL_FILTERS = gql`
  query ModelFilters($appName: String!, $modelName: String!) @api(name: app){
    modelFilters(appName:$appName, modelName: $modelName){
      filtersData
    }
  }

`


export const GET_FILTERED_INSTANCES = gql`
  query FilteredInstances($appName: String!, $modelName: String!, $queryString: String!) @api(name: app){
    runFilter(appName: $appName, modelName:$modelName, queryString: $queryString){
      instances
    }
  }
`


export const GET_SEARCHED_INSTANCES  = gql`
  query SearchedInstances($appName: String!, $modelName: String!, $searchString: String!,  $filterQueryString: String) @api(name: app){
    runSearch(appName: $appName, modelName:$modelName, searchString: $searchString, filterQueryString:$filterQueryString){
      instances
    }
  }

`


export const GET_SUPPORT_TICKETS = gql`
  query AllTickets($offset: Int!, $limit: Int!) @api(name: chat){
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
  query MessagesByTicket($id: Int!, $offset: Int!, $limit: Int!) @api(name: chat){
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







