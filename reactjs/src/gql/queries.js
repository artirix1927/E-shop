import { gql } from "@apollo/client";


export const GET_CATEGORIES = gql`
query{
    allCategories{
      id
      name
      shortname
    }
  }
`;

export const GET_PRODUCTS = gql`
query{
    allProducts{
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

export const GET_PRODUCTS_BY_CATEGORY = gql`
    query products($category: String!){
        productsByCategory(category:$category){
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
    query products($search: String!, $category:String!){
        productsBySearch(search:$search, category:$category){
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


export const GET_PRODUCT_BY_ID = gql`
    query Product($id: Int!){
        productById(id:$id){
            name
            description
            weight
            piecesLeft
            price
            attachments{
                image
            }
        }
    }
`


export const GET_CART_BY_USER = gql`
    query CartById($id: Int!){
        cartByUser(id:$id){
            product{
              name
              description
              weight
              piecesLeft
              price
              attachments{
                image
              }
            }
            id
            quantity
        }
    }
`