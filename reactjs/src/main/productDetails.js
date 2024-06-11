
import '../css/productDetails.scss'




import { useQuery } from "@apollo/client";

import { useState } from 'react';
import {useParams } from "react-router-dom";


import { GET_PRODUCT_BY_ID } from '../gqlQueries';


export const ProductDetails = () => {
    const {id} = useParams();
    let { data, loading, error } = useQuery(GET_PRODUCT_BY_ID, {variables:{id:parseInt(id)},});

    if (loading) return "Loading...";
    if (error) return <pre>{error.message}</pre>
    

    data = data.productById;
    
    const firstImageUrl = data.attachments[0].image;
    
    return <div className='container px-0'>
    
        <div className='row'>
            <div className='gallery col'>
                <img src={firstImageUrl} alt='...' width="100%"/>
            </div>

            <div className='content col-6 '>
                <div className='name'>
                    <h2>{data.name}</h2>
                </div>
                <hr/>
                <div className='price'>
                    <h2>{data.price} $CAD</h2>
                </div>
                <hr/>
                <div className='description'><p>{data.description}</p></div>
            </div>

            <div className='card'>
                <div className='card-body'>
                    <div className='price'>
                        <h3>{data.price} $CAD</h3>
                    </div>
                    <hr/>
                    <div className='pieces-left'>
                        <h5 style={{color:data.piecesLeft ? "green" : "red"}}>
                            {data.piecesLeft ? "In Stock": "Not In Stock"}
                        </h5>

                        <h5>Pieces Left: {data.piecesLeft}</h5>

                    </div>
                    <hr/>

                    <div className='card-btns'>
                        
                        { data.piecesLeft && <QuantityDropdown piecesLeft={data.piecesLeft}/> }   


                        <div className='card-buy-btns'>
                            <div>
                                <button className='btn btn-warning'>Add to cart <i className="bi bi-cart-plus"></i></button>
                            </div>

                            <div>
                                <button className='btn btn-success '>Buy Now <i className="bi bi-cash-stack"></i></button>
                            </div>
                        </div>
            
                    </div>
                </div>
            </div>
        </div>
    </div>
}


const QuantityDropdown = (props) => {
    const [dropdownValue, setDropdownValue] = useState(1) 

    const handleDropdownClick = (e) =>{
        setDropdownValue(e.target.innerText)
    }


    const QuanityArray = Array.from(Array(props.piecesLeft).keys())
    return <div className="dropdown-center">
        <button className="btn btn-secondary dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">
        Quantity: {dropdownValue}
        </button>
        <ul className="dropdown-menu">

            {QuanityArray.map((key)=>{
                return <li  key={key+1}><button className="dropdown-item" onClick={handleDropdownClick}>{key+1}</button></li>
                })

            }

        </ul>
    </div>
}