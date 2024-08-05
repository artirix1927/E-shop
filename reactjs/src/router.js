import { AdminPage, CartPage, CheckoutPage, CreateModalInstancePage, LoginPage, LogoutPage, MainPage, 
    ModelInstancesPage, 
    ModelPanelPage, 
    ProductDetailsPage, RegisterPage, SupportTicketsPage, 
    UpdateModelInstancePage} from "./pages";


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

          <Route path="" element={<AdminPage/>}></Route>
          <Route path="models-panel" element={<ModelPanelPage/>}></Route>
          <Route path="tickets" element={<SupportTicketsPage/>}></Route>
          <Route path="model-instances" element={<ModelInstancesPage/>}></Route>
          <Route path="instance-update" element={<UpdateModelInstancePage/>}></Route>

          <Route path="instance-create" element={<CreateModalInstancePage/>}></Route>
        </Route>
      </>
    )
  );



export const getRouter = () => {

    return router;

}

