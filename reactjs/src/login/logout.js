import { useEffect } from "react"
import { useCookies } from "react-cookie"
import { useNavigate } from "react-router-dom"
import { LOGOUT_USER } from "../gqlQueries"
import { useLazyQuery, useMutation } from "@apollo/client"

export const Logout = () => {
    let [logout, {data}] = useMutation(LOGOUT_USER)
    const [cookies, setCookies, removeCookies] = useCookies('user')
    const navigate = useNavigate()

    useEffect(()=>{

        logout()
        if (data){
            removeCookies('user')
            navigate(-1);
        }
            
    }, [data])

}