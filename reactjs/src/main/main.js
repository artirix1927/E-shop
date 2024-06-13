import { useContext, useEffect, useRef, useState } from 'react';
import '../css/main.scss'

import { useQuery, useLazyQuery } from "@apollo/client";

import { Link, useNavigate } from 'react-router-dom';

import { productsContext } from '../ProductsHandlerProvider';

import { GET_CATEGORIES, GET_PRODUCTS_BY_CATEGORY, GET_PRODUCTS, GET_PRODUCTS_BY_SEARCH} from '../gqlQueries';

import { useCookies } from 'react-cookie';



export const Navbar = () =>{


    const [cookies] = useCookies(['user']);
  
    return <nav className='navbar navbar-expand-lg'>
        <div className="container-fluid">
            
            <div className="navbar-nav">
                <Link className='nav-link' to="/">Home</Link>
            </div>
            
            <form className="d-flex input-group" action='/'>
                    <SearchBar/>
            </form>
            <div className="navbar-nav">{(cookies.user) ? 
            <Link className='nav-link' to='/logout'>Logout | {cookies.user.username}</Link>
            : 
            <Link className='nav-link' to='/login'>Log In</Link>
            }</div>
            
      
            

        </div>
    </nav>
}


const SearchBar = () => {
    const [categoryDropdown, setCategoryDropdown ] = useState('all')

    const {setProductsData} = useContext(productsContext);
    
    let [getProductsBySearch, {data}] = useLazyQuery(GET_PRODUCTS_BY_SEARCH)

    const searchRef = useRef()

    const navigate = useNavigate();

    useEffect(()=>{
        if (data){
            setProductsData(data.productsBySearch)
        }
    },[data, setProductsData])

    const SearchOnClick = (e) => {
        e.preventDefault();
        getProductsBySearch({ variables: { category: categoryDropdown, search:searchRef.current.value}});
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

    const { data, loading, error } = useQuery(GET_CATEGORIES);

    if (loading) return "Loading...";
    if (error) return <pre>{error.message}</pre>

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

    const {setProductsData} = useContext(productsContext);
    
    let [getProductsByCategory, {data}] = useLazyQuery(GET_PRODUCTS_BY_CATEGORY)
    
    useEffect(()=>{
        if (data){
            setProductsData(data.productsByCategory)
            }
    },[data, setProductsData])

    const categoryOnclick = (e) => {
        const category_shortname = e.target.getAttribute("data-shortname")
        getProductsByCategory({ variables: { category: category_shortname } });
    }

    const query = useQuery(GET_CATEGORIES);

    if (query.loading) return "Loading...";
    if (query.error) return <pre>{query.error.message}</pre>

    
    return <div className='categories-line'>

           {query.data.allCategories.map((category)=>{
                return <Link to='/' data-shortname={category.shortname} className='btn btn-link btn-category ' 
                onClick={categoryOnclick} key={category.id}>{category.name}</Link>
           })}
           
    </div>

}


export const ProductsList = () => {
    const {productsData} = useContext(productsContext)

    let { data, loading, error } = useQuery(GET_PRODUCTS);

    if (loading) return "Loading...";
    if (error) return <pre>{error.message}</pre>

    data = productsData ? productsData : data.allProducts;
    

    return <div className='container'>
        <div className='products-list'>
            {data.map((product)=> {
                return <ProductCard key={product.id} data={product}/>
            })}

        </div>

    </div>
}



export const ProductCard = (props) => {
    //on the name i use bootstrap turncation because i need only one line
    // and on the description i use this function 
    const truncate = (str, symbols) => {
        return str.length > symbols ? str.substring(0, symbols) + "..." : str;
    }

    const data = props.data;

    const firstImageUrl = data.attachments[0].image;

    return <div className="card">
        <img src={firstImageUrl} className="card-img-top" alt="..." />
        <div className="card-body">
            <h5 className="card-title text-truncate">{data.name}</h5>
            <h5 className="card-title">{data.price} $CAD</h5>
            <p className="card-text ">{truncate(data.description, 200)}</p>
            <Link className="btn btn-primary" to={`/product/${data.id}`}>Read More</Link>
            
            <button className="btn btn-warning cartbtn"><i className="bi bi-cart-plus"></i></button>
        </div>
    </div>
}