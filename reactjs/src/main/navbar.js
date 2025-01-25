import { useContext, useRef, useState } from 'react';
import '../css/main.scss'

import { useQuery} from "@apollo/client";

import { Link, useNavigate } from 'react-router-dom';

import { filtersContext } from '../providers/filtersProvider';

// import { GET_CATEGORIES, GET_PRODUCTS_BY_CATEGORY, GET_PRODUCTS, GET_PRODUCTS_BY_SEARCH, ADD_TO_CART} from '../gqlQueries';

import { GET_CATEGORIES, GET_PRODUCTS_BY_CATEGORY, GET_PRODUCTS_BY_SEARCH } from './gql/queries';


import { useCookies } from 'react-cookie';





export const Navbar = () =>{

    const {setFiltersData} = useContext(filtersContext);

    const resetProductContextOnHomeClick = ()=>{
        //when chosing a category and then clicking home, 
        //resetting context state so the components uploads all products
        setFiltersData()
    }

    const [cookies] = useCookies();
  
    return <nav className='navbar navbar-expand-lg'>
        <div className="container-fluid">
            
            <div className="navbar-nav" style={{float:'left'}}>
                <Link className='nav-link' to="/" onClick={resetProductContextOnHomeClick}>Home</Link>
            </div>
            <div className='center-container'>
                <form className="d-flex input-group" action='/'>
                        <SearchBar/>
                </form>
            </div>
            <div className="navbar-nav" style={{float:'right'}}>
                
                {(cookies.user) ? 
                <>
                    <Link className='nav-link' to='/cart'>Cart <i className="bi bi-cart-plus"></i></Link>
                    <Link className='nav-link' to='/logout'>Logout | {cookies.user.username}</Link>
                </>
                : 
                <Link className='nav-link' to='/login'>Log In</Link>
                }
                    
            </div>
    

        </div>
    </nav>
}


const SearchBar = () => {
    const [categoryDropdown, setCategoryDropdown ] = useState('all')

    const {setFiltersData} = useContext(filtersContext);

    const searchRef = useRef()

    const navigate = useNavigate();

    const SearchOnClick = (e) => {
        e.preventDefault();
        setFiltersData({query: GET_PRODUCTS_BY_SEARCH, variables:{category: categoryDropdown, search:searchRef.current.value} });
        navigate('/')

        
    }
 

    return <>
        <DropdownCategoriesMenu categoryDropdown={categoryDropdown} setCategoryDropdown={setCategoryDropdown}/>
        <input type="text" className="form-control" placeholder="Search" 
                aria-label="Search" aria-describedby="button-addon2" ref={searchRef}/>

        <button className="btn btn-light" type="submit"
                id="button-addon2" onClick={SearchOnClick}><i className="bi bi-search"></i></button>
    </>
}

const DropdownCategoriesMenu = (props) =>{
    const dropdownOnclick = (e) =>{
            const categoryChosen = e.target.innerText;

            const setValue = categoryChosen !== props.categoryDropdown ? categoryChosen : 'all'

            props.setCategoryDropdown(setValue) 
    }

    const { data, loading } = useQuery(GET_CATEGORIES);

    if (loading) return "Loading...";

    return <>
        <button className="btn btn-light dropdown-toggle" type="button" 
                data-bs-toggle="dropdown" aria-expanded="false">{props.categoryDropdown}</button>

        <ul className="dropdown-menu">
            {data.allCategories.map((category) => (
                <li className='list-group-item-light' key={category.id}>
                    <button className="dropdown-item" type='button' onClick={dropdownOnclick}>{category.name}</button>
                </li>
            ))
            }
        </ul>
    </>
}




export const CategoriesLine = () => {

    const {setFiltersData} = useContext(filtersContext);

    const categoryOnclick = (e) => {
        const category_name = e.target.innerText
        
        setFiltersData({query: GET_PRODUCTS_BY_CATEGORY, variables: {category: category_name} })
        
    }

    const query = useQuery(GET_CATEGORIES);

    if (query.loading) return "Loading...";
    if (query.error) return <pre>{query.error.message}</pre>

    
    return <div className='categories-line'>

           {query.data.allCategories.map((category)=>{
                return <Link to='/'  className='btn btn-link btn-category ' 
                onClick={categoryOnclick} key={category.id}>{category.name}</Link>
           })}
           
    </div>

}