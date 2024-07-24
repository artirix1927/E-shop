

import "bootstrap-icons/font/bootstrap-icons.css";

import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';

import {
  createBrowserRouter,
  createRoutesFromElements,
  RouterProvider,
  Route,
} from "react-router-dom";


import ApolloAppProvider from "./providers/ApolloProvider";

import { CookiesProvider } from 'react-cookie';

import { Navigate, Outlet } from "react-router-dom";




import { useCookies } from 'react-cookie';
import { CartPage, CheckoutPage, LoginPage, LogoutPage, MainPage, 
        ProductDetailsPage, RegisterPage, SupportTicketsPage } from "./pages";




function App() {

  const  AuthenticatedRoute = () => {
    let isAuthenticated = false;
    const [cookies] = useCookies(['user']);
    if (cookies.user) {
      isAuthenticated = true;
    }
    return isAuthenticated ? <Outlet /> : <Navigate to='/login'/> ;
  }


  const router = createBrowserRouter(
    createRoutesFromElements(
      <>
        <Route path="/" element={<MainPage></MainPage>}/>
        <Route path="/product/:id" element={<ProductDetailsPage></ProductDetailsPage>}/> 

        <Route path="/login" element={<LoginPage/>}/>
        <Route path="/register" element={<RegisterPage/>}></Route>
        <Route path="/logout" element={<LogoutPage/>}></Route>

        
          <Route path="/" element={<AuthenticatedRoute />}>
            <Route path="cart" element={<CartPage />} />
            <Route path="checkout" element={<CheckoutPage />} />
            <Route path="tickets" element={<SupportTicketsPage/>}></Route>
          </Route>
        
        
      </>
    )
  );

  

  return (
    <ApolloAppProvider>
            <CookiesProvider>
              <RouterProvider router={router}>
              </RouterProvider>
            </CookiesProvider>
        </ApolloAppProvider>
    
  );
}

export default App;

