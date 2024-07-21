import { useState } from "react";

import { createContext } from "react";

export const productsContext = createContext();


export const ProductsProvider = ({ children }) => {
    const [productsData, setProductsData] = useState()


    return <>
        <productsContext.Provider value={{productsData, setProductsData}}>
            {children}
        </productsContext.Provider>
    </>
}
