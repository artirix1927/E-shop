

import "bootstrap-icons/font/bootstrap-icons.css";

import 'bootstrap/dist/js/bootstrap'


import { Navbar, CategoriesLine, ProductsList } from './main/main';

import ApolloAppProvider from "./ApolloProvider";
import { ProductsProvider } from "./ProductsHandlerProvider";

import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ProductDetails } from "./main/productDetails";


function App() {

  const MainPage = () => {
    return <ApolloAppProvider>
      <div className="App">
        <ProductsProvider>
          <Navbar></Navbar>
          <CategoriesLine></CategoriesLine>
          <ProductsList></ProductsList>
        </ProductsProvider>
      </div>
    </ApolloAppProvider>
  }

  const ProductDetailsPage = () => {
      return <ApolloAppProvider>
        <div className="App">
          <ProductsProvider>
            <Navbar></Navbar>
            <CategoriesLine></CategoriesLine>
            <ProductDetails/>
          </ProductsProvider>
        </div>
      </ApolloAppProvider>

  }
  


  return (
    <BrowserRouter>
      <Routes>
          <Route path="/" element={<MainPage/>}/>
          <Route path="/product/:id" element={<ProductDetailsPage/>}/> 
      </Routes>
    
    </BrowserRouter>
  );
}

export default App;

