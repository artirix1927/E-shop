import { gql } from "@apollo/client";

export const LOGIN_USER = gql`
  mutation LoginUser($username: String!, $password: String!) @api(name: app){
    loginUser(username: $username, password: $password) {
      user {
        id
        username
        email
        isStaff
      }
    }
  }
`;


export const LOGOUT_USER = gql`
  mutation LogoutUser @api(name: app){
    logoutUser{
      success
    }
  }
`


export const CREATE_USER = gql`
  mutation CreateUser($username: String!, $password: String!, $email: String!) @api(name: app){
    createUser(username: $username, password: $password, email:$email) {
      user {
        id
        username
        email
      }
    }
  }
`;
