
import { Link } from "react-router-dom";

export const AdminPanel = ({children, ...props}) => {
    return <>

    <nav className="nav-wrapper">
        <ul class="nav">
            <li>
                <Link class="nav-link" to="/admin/models-panel/">Models</Link>
            </li>

            <li>
                <Link class="nav-link" to="/admin/tickets/">Tickets</Link>
            </li>
        </ul>
        
    </nav>

    
    <div className="content-after-navbar">
        {children}
    </div>
    
    </>


}
