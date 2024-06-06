

import "bootstrap-icons/font/bootstrap-icons.css";

import 'bootstrap/dist/js/bootstrap'



import { Navbar, CategoriesLine, Products } from './main/main';
import ApolloAppProvider from "./ApolloProvider";

function App() {
  return (
    <ApolloAppProvider>
    <div className="App">
      <Navbar></Navbar>
      <CategoriesLine></CategoriesLine>
      <Products></Products>
    </div>
    </ApolloAppProvider>
  );
}

export default App;

