import { useState } from "react";

import { createContext } from "react";

export const filtersContext = createContext();


export const FiltersProvider = ({ children }) => {
    const [filterData, setFilterData] = useState()


    return <>
        <filtersContext.Provider value={{filterData, setFilterData}}>
            {children}
        </filtersContext.Provider>
    </>
}
