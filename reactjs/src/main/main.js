import { useContext, useState } from 'react';
import '../css/main.scss'

import { useQuery, gql, useLazyQuery } from "@apollo/client";



import { Link } from 'react-router-dom';


import { productsContext } from '../ProductsHandlerProvider';

const GET_CATEGORIES = gql`
query{
    allCategories{
      id
      name
      shortname
    }
  }
`;

const GET_PRODUCTS = gql`
query{
    allProducts{
      id
      name
      description
      price
      attachments{
        image
      }
    }
  }
`;

const GET_PRODUCTS_BY_CATEGORY = gql`
    query products($category: String!){
        productsByCategory(category:$category){
        id
        name
        description
        price
        attachments{
            image
        }
        }
    }
`;

const DropdownCategoriesMenu = () =>{
    const [dropdownValue, setDropdownValue ] = useState('all')

    const dropdownOnclick = (e) =>{
            const categoryChosen = e.target.innerText;

            const setValue = categoryChosen !== dropdownValue ? categoryChosen : 'all'

            setDropdownValue(setValue) 
    }

    const { data, loading, error } = useQuery(GET_CATEGORIES);

    if (loading) return "Loading...";
    if (error) return <pre>{error.message}</pre>

    return <>
        <button className="btn btn-light dropdown-toggle" type="button" 
                data-bs-toggle="dropdown" aria-expanded="false">{dropdownValue}</button>

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

export const Navbar = () =>{

    return <nav className='navbar navbar-expand-lg'>
        <div className="container-fluid">
            
            <div className="navbar-nav">
                <Link className='nav-link' to="/">Home</Link>
            </div>
            
            <form className="d-flex input-group" >
                    <DropdownCategoriesMenu/>

                    <input type="text" className="form-control" placeholder="Search" aria-label="Search" aria-describedby="button-addon2"/>
                    <button className="btn btn-light" type="button" id="button-addon2"><i className="bi bi-search"></i></button>
            </form>
            
            <div className="navbar-nav">
                <Link className='nav-link'>Sign In</Link>
            </div>

        </div>
    </nav>
}

export const CategoriesLine = () => {

    const {setProductsData} = useContext(productsContext);
    
    let [getProductsByCategory, {data}] = useLazyQuery(GET_PRODUCTS_BY_CATEGORY)

    if (data){
        setProductsData(data)
    }

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

    data = productsData ? productsData.productsByCategory : data.allProducts;
    

    return <div className='container'>
        <div className='products-list'>
            {data.map((product)=> {
                return <ProductCard key={product.id} data={product}/>
            })}

        </div>

    </div>
}



export const ProductCard = (props) => {

    const truncate = (str, symbols) => {
        return str.length > symbols ? str.substring(0, symbols) + "..." : str;
    }

    const data = props.data;

    const firstImageUrl = data.attachments[0].image;

    return <div className="card">
        <img src={firstImageUrl} className="card-img-top" alt="..." />
        <div className="card-body">
            <h5 className="card-title">{truncate(data.name, 18)}</h5>
            <h5 className="card-title">{data.price} $CAD</h5>
            <p className="card-text ">{truncate(data.description, 200)}</p>
            <Link className="btn btn-primary" to={`/product/${data.id}`}>Read More</Link>
            
            <button className="btn btn-warning cartbtn"><i className="bi bi-cart-plus"></i></button>
        </div>
    </div>
}