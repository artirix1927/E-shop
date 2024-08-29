import { Login } from "./login/login";
import {useBodyClass} from "./hooks";
import { Register } from "./login/register";
import { Logout } from "./login/logout";
import { BuyNowCheckout, CartCheckout } from "./checkout/checkout";

import { Cart } from "./cart/cart";
import { FiltersProvider } from "./providers/filtersProvider";

import { ProductsList } from './main/main';
import { ProductDetails } from "./details/productDetails";
import { CategoriesLine, Navbar } from "./main/navbar";
import { SupportTicketsList } from "./admin/supportChat/supportTickets";
import { AdminPanel } from "./admin/panel/panel";
import { ModelInstancesList } from "./admin/panel/modelInstances";
import { UpdateModelInstance } from "./admin/panel/updateModelInstsance";
import { CreateModelInstance } from "./admin/panel/createModelInstance";
import { ModelsPanel } from "./admin/panel/modelsPanel";
import { SupportChatModal } from "./main/supportChat/supportChat";
import { useCookies } from "react-cookie";


const NavbarPageMixin = (props) => {
    const [cookies] = useCookies(['user'])

    return <FiltersProvider>
      
            <Navbar></Navbar>
            <CategoriesLine></CategoriesLine>
            {props.children}
            { cookies.user &&
            <SupportChatModal></SupportChatModal>
            }
      
      
      </FiltersProvider>
    

  }



export const MainPage = () => {
    useBodyClass('main')

    return <div className="App">
      <NavbarPageMixin>
        <ProductsList/>
      </NavbarPageMixin>
    </div>

}

export const ProductDetailsPage = () => {
    return <div className="App">
      <NavbarPageMixin>
        <ProductDetails/>
      </NavbarPageMixin>
    </div>
}

export const CartPage = () => {
    return <div className="App">
        <NavbarPageMixin>
          <Cart/>
        </NavbarPageMixin>
      </div>
}

export const LoginPage = () => {
    useBodyClass('login')

    return <div className="App">

        <Login></Login>
      </div>

  }

export const RegisterPage = () => {
    useBodyClass('login')

    return <div className="App">
        <Register></Register>
      </div>

  }

export const LogoutPage = () => {
    return <div className="App">
        <Logout></Logout>
      </div>

  }

export const CartCheckoutPage = () => {

    return <div className="App">
      <CartCheckout></CartCheckout>
    </div>
  }

  export const BuyNowCheckoutPage = () => {

    return <div className="App">
      <BuyNowCheckout></BuyNowCheckout>
    </div>
  }


export const SupportTicketsPage = () => {
  return <div className="App">
      <AdminPanel>
      <SupportTicketsList></SupportTicketsList>
      </AdminPanel>
    </div>
}




export const AdminPage = () =>  {
  return <div className="App">
    <AdminPanel></AdminPanel>
  </div>
}

export const ModelPanelPage = () => {


  return <div className="App"> 
      <AdminPanel>
        <ModelsPanel></ModelsPanel>
      </AdminPanel>

  </div>
}

export const ModelInstancesPage = () =>  {
  return <div className="App">
     <AdminPanel>
     <ModelInstancesList></ModelInstancesList>
     </AdminPanel>
    
  </div>
}


export const UpdateModelInstancePage = () => {
  return <div className="App">
    <AdminPanel>
      <UpdateModelInstance></UpdateModelInstance>
    </AdminPanel>
    
  </div>

}

export const CreateModalInstancePage = () => {
  return <div className="App">
    <AdminPanel>
      <CreateModelInstance></CreateModelInstance>
    </AdminPanel>
    
  </div>

  
}