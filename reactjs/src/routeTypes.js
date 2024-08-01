
import { Navigate, Outlet } from "react-router-dom";
import { useCookies } from 'react-cookie';
  

  

export const  AuthenticatedRoute = () => {
    let isAuthenticated = false;
    const [cookies] = useCookies(['user']);
    console.log(cookies)
    if (cookies.user) {
      isAuthenticated = true;
    }
    return isAuthenticated ? <Outlet /> : <Navigate to='/login'/> ;
  }


export const AdminRoute = () => {
    let isAdmin = false;
    const [cookies] = useCookies(['user']);
    
    if (cookies.user && cookies.user.isStaff) {
      isAdmin = true;
    }
    return isAdmin ? <Outlet /> : <Navigate to='/login'/> ;

  }