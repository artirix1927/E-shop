
import '../css/productDetails.scss'




import { useMutation, useQuery } from "@apollo/client";

import { useRef, useState } from 'react';
import { useParams } from "react-router-dom";


// import { ADD_TO_CART, GET_PRODUCT_BY_ID } from '../gqlQueries';

import { ADD_TO_CART } from '../gql/mutations';
import { GET_PRODUCT_BY_ID } from '../gql/queries';
import { useCookies } from 'react-cookie';


export const ProductDetails = () => {
    const {id} = useParams();

    let { data,loading,error} = useQuery(GET_PRODUCT_BY_ID, {variables:{id:parseInt(id)},});

    if (loading) return "Loading...";
    if (error) return <pre>{error.message}</pre>


    data = data.productById;
    //console.log(data)
    
    return <div className='product-container'>
    
        <div className='row'>
            <div className='col gallery'>
                <Gallery attachments={data.attachments}></Gallery>
            </div>

            <div className='content col-6'>
                <div className='name'>
                    <h2>{data.name}</h2>
                </div>

                <hr/>

                <div className='price'>
                    <h2>{data.price} $CAD</h2>
                </div>

                <hr/>

                <div className='description'>
                    <p>{data.description}</p>
                </div>

                <table className='characteristics-table table table-borderless'>
                    {data.characteristics.map((char)=>{
                    return <tr>
                            <td>{char.characteristic.name}</td>
                            <td>{char.value}</td>
                        </tr>
                    })}
                </table>

            </div>

            <div className='card col-4'>
                <BuyCard price={data.price} piecesLeft={data.piecesLeft}></BuyCard>
            </div>
            

            
        </div>
    </div>
}


const BuyCard = (props) => {
    const {id} = useParams();

    const [cookies] = useCookies()    
    const [quantityDropdownValue, setQuantityDropdownValue] = useState(1) 

    const [addToCart] = useMutation(ADD_TO_CART)

    const HandleAddToCart = () => {
        addToCart({variables: {userId: parseInt(cookies.user.id), productId: parseInt(id), quantity: parseInt(quantityDropdownValue)}})
    }


    return <>
            <div className='card-body'>
                <div className='price'>
                    <h3>{props.price} $CAD</h3>
                </div>
                <hr/>
                <div className='pieces-left'>
                    <IsInStock piecesLeft={props.piecesLeft}/>
                </div>
                <hr/>

                <div className='card-btns'>
            
                    { props.piecesLeft && <QuantityDropdown piecesLeft={props.piecesLeft} 
                    dropdownValue={quantityDropdownValue} setDropdownValue={setQuantityDropdownValue}/> }   


                    <div className='card-buy-btns'>
                        <div>
                            <button className='btn btn-warning' onClick={HandleAddToCart}>Add to cart <i className="bi bi-cart-plus"></i></button>
                        </div>

                        <div>
                            <button className='btn btn-success '>Buy Now <i className="bi bi-cash-stack"></i></button>
                        </div>
                    </div>
        
                </div>
            </div>
    </>
}



export const QuantityDropdown = (props) => {

    const handleDropdownClick = (e) =>{
        props.setDropdownValue(e.target.innerText)
    }
    

    const QuanityArray = Array.from(Array(props.piecesLeft).keys())
    return <div className="dropdown-center">
        <button className="btn btn-secondary dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">
        Quantity: {props.dropdownValue}
        </button>
        <ul className="dropdown-menu">

            {QuanityArray.map((key)=>{
                return <li  key={key+1}><button className="dropdown-item" onClick={handleDropdownClick}>{key+1}</button></li>
                })

            }

        </ul>
    </div>
}


const Gallery = (props) => {
    const [currentImageSrc, setCurrentImageSrc] = useState(props.attachments[0].image)
    
    //li element ref to highlight active photo
    const currentImageLiElem = useRef()

    const HandleImageClick = (e) => {
        const clickedImage = e.target
        const newImageLiElem = e.target.parentElement;

        currentImageLiElem.current.classList.remove('active')
        newImageLiElem.classList.add('active')
        
        currentImageLiElem.current = newImageLiElem;
        setCurrentImageSrc(clickedImage.src)
    }

    return <>
        <ul className='gallery-images'>
                        {props.attachments.map((obj, index)=>{
                            if (index===0)
                                return <li key={index} className='active' ref={currentImageLiElem}><img src={obj.image} alt="" key={index} onClick={HandleImageClick}></img></li>

                            return <li key={index}><img src={obj.image} alt="" key={index} onClick={HandleImageClick}></img></li>
                          
                        })}
            
        </ul>
        <div>
            <img src={currentImageSrc} alt='...'></img>
        </div>

    </>
}

export const IsInStock = (props) => {
    return <>
    <h5 style={{color:props.piecesLeft ? "green" : "red"}}>
        {props.piecesLeft ? "In Stock": "Not In Stock"}
    </h5>
    <h5>Pieces Left: {props.piecesLeft}</h5>
    </>

}