

import "bootstrap-icons/font/bootstrap-icons.css";

import 'bootstrap/dist/js/bootstrap'


import { Navbar, CategoriesLine, ProductsList } from './main/main';

import ApolloAppProvider from "./ApolloProvider";
import { ProductsProvider } from "./ProductsHandlerProvider";
import { CookiesProvider } from 'react-cookie';

import { BrowserRouter, Routes, Route } from "react-router-dom";

import { ProductDetails } from "./main/productDetails";

import { Login } from "./login/login";
import {useBodyClass} from "./hooks";
import { Register } from "./login/register";
import { Logout } from "./login/logout";



function App() {

  const NavbarPageMixin = (props) => {

    return <ProductsProvider>
        <div className="App">
        <Navbar></Navbar>
        <CategoriesLine></CategoriesLine>
        {props.children}
        </div>
      </ProductsProvider>
    

  }

  const LoginPage = () => {
    useBodyClass('login')

    return <div className="App">

        <Login></Login>
      </div>

  }

  const RegisterPage = () => {
    useBodyClass('login')

    return <div className="App">
        <Register></Register>
      </div>

  }

  const LogoutPage = () => {
    return <div className="App">
        <Logout></Logout>
      </div>

  }
 

  


  return (
    <BrowserRouter>
        
        <ApolloAppProvider>
            <CookiesProvider>
              <Routes>
                  <Route path="/" element={<NavbarPageMixin><ProductsList/></NavbarPageMixin>}/>
                  <Route path="/product/:id" element={<NavbarPageMixin><ProductDetails/></NavbarPageMixin>}/> 
                  <Route path="/login" element={<LoginPage/>}/>
                  <Route path="/register" element={<RegisterPage/>}></Route>
                  <Route path="/logout" element={<LogoutPage/>}></Route>
              </Routes>
            </CookiesProvider>

        </ApolloAppProvider>
        
    </BrowserRouter>
  );
}

export default App;

