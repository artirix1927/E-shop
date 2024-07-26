import { useState } from "react";

import { createContext } from "react";

export const filtersContext = createContext();


export const FiltersProvider = ({ children }) => {
    const [filterData, setFiltersData] = useState()


    return <>
        <filtersContext.Provider value={{filterData, setFiltersData}}>
            {children}
        </filtersContext.Provider>
    </>
}
