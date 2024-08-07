
import { GET_AVAILABLE_COUNTRIES, GET_CITIES_BY_COUNTRY_STATE, GET_STATES_BY_COUNTRY } from "./gql/queries"


import { SelectFieldFormik } from "../global_components"
import { useEffect, useState } from "react"
import { useQuery } from "@apollo/client"



export const SelectCountriesField = (props) => {
    const query = GET_AVAILABLE_COUNTRIES

    return <><AdressSelectFieldBase {...props} query={query}/></>
}


export const SelectStatesField = (props) => {
    const queryVariables = {country: props.form.values.country, state: props.form.values.state}
    const query = GET_STATES_BY_COUNTRY

    return <><AdressSelectFieldBase {...props} query={query} queryVariables={queryVariables} name="StatesField" /></>
}


export const SelectCitiesField = (props) => {
   
    const queryVariables = {country: props.form.values.country, state: props.form.values.state}
    const query = GET_CITIES_BY_COUNTRY_STATE

    return <><AdressSelectFieldBase {...props} query={query} queryVariables={queryVariables}/></>
}



const AdressSelectFieldBase = (props) => {
    
    const {data} = useQuery(props.query, {variables:{...props.queryVariables}})
    
    const [selectOptions, setSelectOptions] = useState([])

    useEffect(() => {
        let options = []
        
        if (data){
            const reponseValues = Object.values(data)[0]
            reponseValues.map((node)=>{
                
                return options = [...options, {label: node.name, value: node.name}]
            })
        }
        setSelectOptions(options)
    },[data, props.form.values])


    return <><SelectFieldFormik {...props} options={selectOptions}/></>
}