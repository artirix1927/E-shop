import { useBodyClass } from "../hooks";

import { BuyNowCheckout, CartCheckout } from "../checkout/checkout";

import { Cart } from "../cart/cart";
import { FiltersProvider } from "../providers/filtersProvider";

import { ProductsList } from '../main/main';
import { ProductDetails } from "../details/productDetails";
import { CategoriesLine, Navbar } from "../main/navbar";

import { SupportChatModal } from "../main/supportChat/supportChat";
import { useCookies } from "react-cookie";
import { ReviewSection } from "../reviews/reviewsSection";



import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from "@stripe/stripe-js/pure";
import CheckoutForm from "../payments/checkoutForm";

const NavbarPageMixin = (props) => {
  const [cookies] = useCookies(['user'])

  return <FiltersProvider>

    <Navbar></Navbar>
    <CategoriesLine></CategoriesLine>
    {props.children}
    {cookies.user &&
      <SupportChatModal></SupportChatModal>
    }


  </FiltersProvider>


}



export const MainPage = () => {
  useBodyClass('main')

  return <div className="App">
    <NavbarPageMixin>
      <ProductsList />
    </NavbarPageMixin>
  </div>

}

export const ProductDetailsPage = () => {
  return <div className="App">
    <NavbarPageMixin>
      <ProductDetails />
      <ReviewSection />
    </NavbarPageMixin>
  </div>
}

export const CartPage = () => {
  return <div className="App">
    <NavbarPageMixin>
      <Cart />
    </NavbarPageMixin>
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




export const StripeTestCheckoutPage = () => {


  return <CheckoutForm/>
}