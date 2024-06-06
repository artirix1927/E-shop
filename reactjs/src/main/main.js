import { useEffect, useState } from 'react';
import '../css/main.scss'

import { useQuery, gql } from "@apollo/client";

const GET_CATEGORIES = gql`
query{
    allCategories{
      name
    }
  }
`;


const GET_PRODUCTS = gql`
query{
    allProducts{
      name
      description
      price
      attachments{
        image
      }
    }
  }
`;

const GET_PRODUCT_BY_ID = (id)=>{

}


export const Navbar = () =>{

    return <nav className='navbar navbar-expand-lg'>
        <div class="container-fluid">
            
            <div class="navbar-nav">
                <a className='nav-link'>Home</a>
            </div>
            <form className="d-flex input-group">

                <button class="btn btn-light dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">Dropdown</button>
                <ul class="dropdown-menu">
                    <li><a class="dropdown-item" href="#">Action before</a></li>
                    <li className='list-group-item-light'><a class="dropdown-item" href="#">Another action before</a></li>
                    <li className='list-group-item-light'><a class="dropdown-item" href="#">Something else here</a></li>

                </ul>

                
                    <input type="text" className="form-control" placeholder="Search" aria-label="Search" aria-describedby="button-addon2"/>
                    <button className="btn btn-light" type="button" id="button-addon2"><i class="bi bi-search"></i></button>
            </form>
            <div class="navbar-nav">
                <a className='nav-link'>Sign In</a>
            </div>
        </div>
    </nav>
}


export const CategoriesLine = () => {
    const { data, loading, error } = useQuery(GET_CATEGORIES);

    if (loading) return "Loading...";
    if (error) return <pre>{error.message}</pre>
    
    return <div className='categories-line'>
           {data.allCategories.map((category)=>{

                return <a>{category.name}</a>
           
           })}
    </div>

    
}


export const Products = () => {
    const { data, loading, error } = useQuery(GET_PRODUCTS);

    if (loading) return "Loading...";
    if (error) return <pre>{error.message}</pre>

    console.log(data)

    return <div className='container'>
        {data.allProducts.map((product)=> {
            return <ProductCard data={product}/>
        })}

    </div>
}



export const ProductCard = (props) => {
    const truncate = (str, symbols) => {
        return str.length > symbols ? str.substring(0, symbols) + "..." : str;
    }


    const data = props.data;
    console.log(data)
    const firstImageUrl = data.attachments[0].image;

    return <div class="card">
        <img src={firstImageUrl} class="card-img-top" alt="..." />
        <div class="card-body">
            <h5 class="card-title">{data.name}</h5>
            <h5 class="card-title">{data.price} $CAD</h5>
            <p class="card-text ">{truncate(data.description, 200)}</p>
            <a href="#" class="btn btn-primary">Read More</a>
            <a href="#" class="btn btn-warning cartbtn"><i class="bi bi-cart-plus"></i></a>
        </div>
    </div>
}