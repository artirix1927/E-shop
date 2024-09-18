import { gql } from "@apollo/client";


export const GET_CATEGORIES = gql`

query @api(name: app){
    allCategories {
      id
      name
      shortname
    }
  }
`;


export const GET_PRODUCTS_BY_CATEGORY = gql`
    query products($offset: Int!, $limit: Int!, $category: String!) @api(name: app){
        productsByCategory(offset: $offset, limit: $limit, category:$category){
        id
        name
        description
        price
        attachments{
            image
        }
        }
    }
`;



export const GET_PRODUCTS_BY_SEARCH = gql`
    query products($offset: Int!, $limit: Int!, $search: String!, $category:String!) @api(name: app){
        productsBySearch(offset: $offset, limit: $limit, search:$search, category:$category){
        id
        name
        description
        price
        attachments{
            image
        }
        }
    }
`;


export const GET_PRODUCTS = gql`
query AllProducts($offset: Int!, $limit: Int!) @api(name: app){
    allProducts(offset: $offset, limit: $limit){
      id
      name
      description
      price
      attachments{
        image
      }
    }
  }
`;



export const GET_SUPPORT_TICKETS_BY_USER = gql`
  query TicketssByUser($user:Int!) @api(name: chat){
    ticketsByUser(user:$user){
      id
      closed
      user{
        username
      }
    }
  }
`