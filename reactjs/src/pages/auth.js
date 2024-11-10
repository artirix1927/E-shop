
import { Login } from "../login/login";
import {useBodyClass} from "../hooks";
import { Register } from "../login/register";
import { Logout } from "../login/logout";



export const LoginPage = () => {
    useBodyClass('login')

    return <div className="App">

        <Login></Login>
      </div>

  }

export const RegisterPage = () => {
    useBodyClass('login')

    return <div className="App">
        <Register></Register>
      </div>

  }

export const LogoutPage = () => {
    return <div className="App">
        <Logout></Logout>
      </div>

  }