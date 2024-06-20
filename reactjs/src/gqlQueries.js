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




export const LOGIN_USER = gql`
  mutation LoginUser($username: String!, $password: String!) {
    loginUser(username: $username, password: $password) {
      user {
        id
        username
        email
      }
    }
  }
`;


export const CREATE_USER = gql`
  mutation CreateUser($username: String!, $password: String!, $email: String!) {
    createUser(username: $username, password: $password, email:$email) {
      user {
        id
        username
        email
      }
    }
  }
`;

export const LOGOUT_USER = gql`
  mutation LogoutUser{
    logoutUser{
      success
    }
  }
`


 
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


export const ADD_TO_CART = gql`
  mutation Cart($userId: Int!, $productId: Int!, $quantity: Int!){
    addToCart(userId: $userId, productId: $productId, quantity: $quantity){
      success
    }
  }
`


export const CHANGE_CART_ITEM_QUANTITY = gql`
  mutation ChangeCartItemQuantity($id: Int!, $quantity: Int!){
    changeCartItemQuantity(id: $id, quantity: $quantity){
      success
    }
  }
`

export const DELETE_FROM_CART = gql`
  mutation DeleteFromCart($id: Int!){
    deleteFromCart(id: $id){
      success
    }
  }
`