

import "bootstrap-icons/font/bootstrap-icons.css";

import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';


import ApolloAppProvider from "./providers/ApolloProvider";

import { CookiesProvider } from 'react-cookie';
import { getRouter } from "./router";

import { RouterProvider } from "react-router-dom";



function App() {
  const router = getRouter()

  
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

