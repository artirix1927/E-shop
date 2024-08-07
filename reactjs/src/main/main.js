import { useState } from 'react';
import '../css/main.scss'

import { useMutation } from "@apollo/client";

import { Link } from 'react-router-dom';



import { ADD_TO_CART } from './gql/mutations';

import { useCookies } from 'react-cookie';

import { ProductsInfiniteScroll } from './produtsInfiniteScroll';



export const ProductsList = () => {
    const [items, setItems] = useState([]);


    return <div className='container'>
           
                {/* <ProductsInfiniteScroll setItems={setItems} items={items}>
                <div  className='products-list' > 
                {
                    items.map((product, index)=> {
                        return <ProductCard key={index} data={product}/>
                    })
                }
                </div>

                </ProductsInfiniteScroll> */}
                <div className="products-list">
                        <ProductsInfiniteScroll setItems={setItems} items={items} className="products-list">
                
                            {items.map((product, index) => (
                                <ProductCard key={index} data={product} />
                            ))}
                            
                        </ProductsInfiniteScroll>
                    
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


