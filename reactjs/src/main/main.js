import { useContext } from 'react';
import '../css/main.scss'

import { useQuery, useMutation } from "@apollo/client";

import { Link } from 'react-router-dom';

import { productsContext } from '../providers/ProductsHandlerProvider';

import {  GET_PRODUCTS } from '../gql/queries';
import { ADD_TO_CART } from '../gql/mutations';

import { useCookies } from 'react-cookie';




export const ProductsList = () => {

    const {productsData} = useContext(productsContext)

    let { data, loading} = useQuery(GET_PRODUCTS);

    if (loading) return "Loading...";

    //products from context or from the query
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
    let [addToCart] = useMutation(ADD_TO_CART)

    const [cookies] = useCookies()

    const productData = props.data;
    const firstImageUrl = productData.attachments[0].image;

    const handleAddToCart = (e) => {
        addToCart({variables: {userId: parseInt(cookies.user.id), productId: parseInt(productData.id), quantity:1}})

    }


    return <div className="card">
        <img src={firstImageUrl} className="card-img-top" alt="..." />
        <div className="card-body">
            <h5 className="card-title text-truncate">{productData.name}</h5>
            <h5 className="card-title">{productData.price} $CAD</h5>
            <p className="card-text ellipsify">{productData.description}</p>
            <Link className="btn btn-primary" to={`/product/${productData.id}`}>Read More</Link>
            
            <button className="btn btn-warning cartbtn" onClick={handleAddToCart}><i className="bi bi-cart-plus"></i></button>
        </div>
    </div>
}