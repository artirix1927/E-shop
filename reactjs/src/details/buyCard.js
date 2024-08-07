import { forwardRef, useState } from "react";
import { useCookies } from "react-cookie";
import { Link, useParams } from "react-router-dom";
import { ADD_TO_CART } from "./gql/mutations";
import { IsInStock, Quantity } from "../global_components";
import { useMutation } from "@apollo/client";




export const BuyCard = forwardRef( (props, ref)=>{
    const {id} = useParams();

    const [cookies] = useCookies()    
    const [quantityDropdownValue, setQuantityDropdownValue] = useState(1) 

    const [addToCart] = useMutation(ADD_TO_CART)

    const HandleAddToCart = () => {
        addToCart({variables: {userId: parseInt(cookies.user.id), productId: parseInt(id), quantity: parseInt(quantityDropdownValue)}})
    }

    //const checkoutRouteParameters = [{quantity: quantityDropdownValue, item:''}]

    return <>
            <div className='card-body' ref={ref}>
                <div className='price'>
                    <h3>{props.price} $CAD</h3>
                </div>
                <hr/>
                <div className='pieces-left'>
                    <IsInStock piecesLeft={props.piecesLeft}/>
                </div>
                <hr/>

                <div className='card-btns'>
            
                    { props.piecesLeft && <Quantity piecesLeft={props.piecesLeft} 
                    dropdownValue={quantityDropdownValue} setDropdownValue={setQuantityDropdownValue}/> }   


                    <div className='card-buy-btns'>
                        <div>
                            <button className='btn btn-warning' onClick={HandleAddToCart}>Add to cart <i className="bi bi-cart-plus"></i></button>
                        </div>

                        <div>
                            <Link className='btn btn-success' to='/checkout' >Buy Now <i className="bi bi-cash-stack"></i></Link>
                        </div>
                    </div>
        
                </div>
            </div>
    </>
    }
)
