import { Login } from "./login/login";
import {useBodyClass} from "./hooks";
import { Register } from "./login/register";
import { Logout } from "./login/logout";
import { Checkout } from "./checkout/checkout";

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


const NavbarPageMixin = (props) => {

    return <FiltersProvider>
        <div className="App">
            <Navbar></Navbar>
            <CategoriesLine></CategoriesLine>
            {props.children}
        </div>
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

export const CheckoutPage = () => {

    return <div className="App">
      <Checkout></Checkout>
    </div>
  }


export const SupportTicketsPage = () => {
  return <div className="App">
      <SupportTicketsList></SupportTicketsList>
    </div>
}


export const AdminPage = () =>  {

  return <div className="App">
    <AdminPanel></AdminPanel>
  </div>

}

export const ModelInstancesPage = () =>  {
  return <div className="App">
    <ModelInstancesList></ModelInstancesList>
  </div>
}


export const UpdateModelInstancePage = () => {
  return <div className="App">
    <UpdateModelInstance></UpdateModelInstance>
  </div>

}

export const CreateModalInstancePage = () => {
  return <div className="App">
    <CreateModelInstance></CreateModelInstance>
  </div>

  
}