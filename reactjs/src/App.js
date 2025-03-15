

import "bootstrap-icons/font/bootstrap-icons.css";

import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';


import ApolloAppProvider from "./providers/ApolloProvider";

import { CookiesProvider } from 'react-cookie';
import { getRouter } from "./router";

import { RouterProvider } from "react-router-dom";
import { FiltersProvider } from "./providers/filtersProvider";



function App() {
  const router = getRouter()

  
  return (
    <ApolloAppProvider>
      <CookiesProvider>
        <FiltersProvider>
        <RouterProvider router={router}>

        </RouterProvider>
       </FiltersProvider>
      </CookiesProvider>
    </ApolloAppProvider>
    
  );
}

export default App;

