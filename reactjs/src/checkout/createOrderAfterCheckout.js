import { useMutation } from "@apollo/client"
import { useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { CREATE_ORDER } from "./gql/mutations"

export const CreateOrderAndRedirect = () =>{
    const nav = useNavigate()
    const [createOrder] = useMutation(CREATE_ORDER)

    useEffect(()=>{
       
        const orderData = JSON.parse(localStorage.getItem("orderData"))
        console.log(orderData)
        createOrder({variables:orderData})
        nav('/')
        
    })
}