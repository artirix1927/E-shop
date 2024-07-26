import { CartPage, CheckoutPage, LoginPage, LogoutPage, MainPage, 
    ProductDetailsPage, RegisterPage, SupportTicketsPage } from "./pages";


import { AuthenticatedRoute, AdminRoute } from "./routeTypes";


import {
    createBrowserRouter,
    createRoutesFromElements,
    Route,
  } from "react-router-dom";



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
        </Route>

        <Route path="admin/" element={<AdminRoute/>}>
          <Route path="tickets" element={<SupportTicketsPage/>}></Route>
        
        </Route>
      </>
    )
  );



export const getRouter = () => {

    return router;

}

