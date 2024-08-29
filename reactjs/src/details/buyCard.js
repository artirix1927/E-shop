import { forwardRef, useState } from "react";
import { useCookies } from "react-cookie";
import { useNavigate, useParams } from "react-router-dom";
import { ADD_TO_CART } from "./gql/mutations";
import { IsInStock, Quantity } from "../global_components";
import { useMutation } from "@apollo/client";





export const BuyCard = forwardRef( (props, ref)=>{
    const {id} = useParams();

    const [cookies] = useCookies()    
    const [quantityDropdownValue, setQuantityDropdownValue] = useState(1) 

    const [addToCart] = useMutation(ADD_TO_CART)

    const navigate = useNavigate()

    const HandleAddToCart = () => {
        addToCart({variables: {userId: parseInt(cookies.user.id), productId: parseInt(id), quantity: parseInt(quantityDropdownValue)}})
    }
    


    const HandleBuyNow = () => {
        navigate('/buy-now-checkout', {state:{product:props.product, productId: parseInt(id), quantity:parseInt(quantityDropdownValue)}})

    }
    //const checkoutRouteParameters = [{quantity: quantityDropdownValue, item:''}]

    return <>
            <div className='card-body' ref={ref}>
                <div className='price'>
                    <h3>{props.product.price} $CAD</h3>
                </div>
                <hr/>
                <div className='pieces-left'>
                    <IsInStock piecesLeft={props.product.piecesLeft}/>
                </div>
                <hr/>

                <div className='card-btns'>
            
                    { props.product.piecesLeft && <Quantity piecesLeft={props.product.piecesLeft} 
                    setDropdownValue={setQuantityDropdownValue}/> }   


                    <div className='card-buy-btns'>
                        <div>
                            <button className='btn btn-warning' onClick={HandleAddToCart}>Add to cart <i className="bi bi-cart-plus"></i></button>
                        </div>

                        <div>
                            <button className='btn btn-success' onClick={HandleBuyNow}>Buy Now <i className="bi bi-cash-stack"></i></button>
                        </div>
                    </div>
        
                </div>
            </div>
    </>
    }
)
