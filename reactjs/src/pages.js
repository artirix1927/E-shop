import { Login } from "./login/login";
import {useBodyClass} from "./hooks";
import { Register } from "./login/register";
import { Logout } from "./login/logout";
import { Checkout } from "./checkout/checkout";

import { Cart } from "./cart/cart";
import { ProductsProvider } from "./providers/ProductsHandlerProvider";

import { ProductsList } from './main/main';
import { ProductDetails } from "./details/productDetails";
import { CategoriesLine, Navbar } from "./main/navbar";


const NavbarPageMixin = (props) => {

    return <ProductsProvider>
        <div className="App">
            <Navbar></Navbar>
            <CategoriesLine></CategoriesLine>
            {props.children}
        </div>
      </ProductsProvider>
    

  }



export const MainPage = () => {
    return <div className="App"><NavbarPageMixin><ProductsList/></NavbarPageMixin></div>

}

export const ProductDetailsPage = () => {
    return <div className="App"><NavbarPageMixin><ProductDetails/></NavbarPageMixin></div>
}

export const CartPage = () => {
    return <div className="App"><NavbarPageMixin><Cart/></NavbarPageMixin></div>
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