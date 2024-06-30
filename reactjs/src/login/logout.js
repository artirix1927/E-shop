import { useEffect } from "react"
import { useCookies } from "react-cookie"
import { useNavigate } from "react-router-dom"
// import { LOGOUT_USER } from "../gqlQueries"
import { LOGOUT_USER } from "../gql/mutations"
import { useMutation } from "@apollo/client"

export const Logout = () => {
    let [logout, {data}] = useMutation(LOGOUT_USER)
    const [,, removeCookies] = useCookies('user')
    const navigate = useNavigate()

    useEffect(()=>{

        logout()
        if (data){
            removeCookies('user')
            navigate(-1);
        }
            
    }, [data, navigate, removeCookies, logout])

}