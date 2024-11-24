

import "bootstrap-icons/font/bootstrap-icons.css";

import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';
import '@stripe/stripe-js';

import ApolloAppProvider from "./providers/ApolloProvider";

import { CookiesProvider } from 'react-cookie';
import { getRouter } from "./router";

import { RouterProvider } from "react-router-dom";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";



function App() {
  const router = getRouter()
  const stripePromise = loadStripe('pk_test_51QOSK0KoAJwrgDT8DDEqG9JdyoyL4u5Ufcjk44kT50L7cqWI2Ybajh8ibaneUn2qfDNPy1ZKz84PxyZAdS3yeehA00lymBJcwg');

  return (
    <ApolloAppProvider>
      <CookiesProvider>
        <Elements stripe={stripePromise}>
          <RouterProvider router={router}>

          </RouterProvider>
        </Elements>
      </CookiesProvider>
    </ApolloAppProvider>

  );
}

export default App;

