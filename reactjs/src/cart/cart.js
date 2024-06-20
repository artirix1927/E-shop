import '../css/cart.scss'


import { useMutation, useQuery } from "@apollo/client";
// import { GET_CART_BY_USER } from "../gqlQueries";
import { useCookies } from 'react-cookie';
import { CHANGE_CART_ITEM_QUANTITY, DELETE_FROM_CART, GET_CART_BY_USER } from "../gqlQueries";
import { IsInStock } from "../main/productDetails";
import { useEffect, useState } from "react";


export const Cart = () => {
    const [cookies] = useCookies();
    
    const { data, loading, error } = useQuery(GET_CART_BY_USER, {variables: {id: parseInt(cookies.user.id)}, fetchPolicy: 'cache-and-network',});

    const [sum,setSum] = useState(0)
    const [itemsCounter, setItemsCounter] = useState(0)

    useEffect(()=>{
        //setting sum value
        if (data){
            let sum=0;
            let itemCounter=0;
            data.cartByUser.map((item) => {
                itemCounter += item.quantity
                return sum+=(item.product.price*item.quantity);
            })
            setSum(sum)
            setItemsCounter(itemCounter)
        }

    },[data, setSum, setItemsCounter])
    

    if (loading) return "Loading...";
    if (error) return <pre>{error.message}</pre>


    return <div className="cart-content d-flex">
        <div className='cart-items-container'>

            {
            data.cartByUser.map((item, index) => {

                return <CartItem item={item} key={index}
                 setSum={setSum} sum={sum}
                 setItemsCounter={setItemsCounter} itemsCounter={itemsCounter}
                 
                 />
            })
            }
            <h5 className="price">{sum} $CAD</h5>


        </div>

        <div className="card" style={{float:'right', paddingInline: 20}}>
            <div className="card-body">
                <h5 className="card-title">Subtotal ({itemsCounter} items),</h5>
                <h5 className="card-title"> {sum} $CAD</h5>
            </div>
            <button className='btn btn-warning'>Procced to checkout</button>
        </div>
        
        
                                                                
    </div>
}


export const CartItem = (props) => {
    const product = props.item.product;
    const attachments = props.item.product.attachments;

    const handleCheckboxOnClick =(e) => {
        const newSum = e.target.checked ? props.sum+(product.price*props.item.quantity) : props.sum-(product.price*props.item.quantity)
        const newCounter = e.target.checked ? props.itemsCounter+(props.item.quantity) : props.itemsCounter - props.item.quantity

        props.setSum(newSum)
        props.setItemsCounter(newCounter)
    }

    return <div className="cart-item">
        
        <DeleteCartItem cartItemId={props.item.id}/>

        <div className="checkbox">
            
            <input className="form-check-input" type="checkbox" value="" defaultChecked={Boolean(product.piecesLeft)} onClick={handleCheckboxOnClick}/>
            
        </div>

    
        <img src={attachments[0].image} alt="..."/>
      
         

        <div className="content" >
        
            <h5 className='price'>{product.price} $CAD</h5>
          
            <h4>{product.name}</h4>
            
            <IsInStock piecesLeft={product.piecesLeft}/>
            
            <div className="quantity">
                <QuantityDropdown piecesLeft={product.piecesLeft} deafult={props.item.quantity} cartItemId={props.item.id}
                                  sum={props.sum} setSum={props.setSum} itemsCounter={props.itemsCounter} setItemsCounter={props.setItemsCounter}/>
            </div>

        </div>
    </div>
}


const QuantityDropdown = (props) => {
    const [dropdownValue, setDropdownValue] = useState(props.deafult) 

    const [setCartItemQuantity] = useMutation(CHANGE_CART_ITEM_QUANTITY, {refetchQueries: [
        GET_CART_BY_USER, // DocumentNode object parsed with gql
        'Cart' // Query name
      ]});

    const handleDropdownClick = (e) =>{
        setDropdownValue(e.target.innerText);
        setCartItemQuantity({variables: {id: parseInt(props.cartItemId), quantity: parseInt(e.target.innerText)}})

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



const DeleteCartItem = (props) => {
    const [deleteFromCart] = useMutation(DELETE_FROM_CART, {refetchQueries: [
        GET_CART_BY_USER, // DocumentNode object parsed with gql
        'Cart' // Query name
      ]});


    const modalId = `deleteModal-${props.cartItemId}`;

    return <>

    <i className="bi bi-x-lg" data-bs-toggle="modal" data-bs-target={`#${modalId}`}></i>
    <div class="modal" tabindex="-1" id={modalId}>
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title">Are you sure you want delete these item/s from cart?</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-primary"  data-bs-dismiss="modal" onClick={
                        ()=>deleteFromCart({variables:{id: parseInt(props.cartItemId)}})
                    }>Yes</button>
                    
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">No</button>
                </div>
            </div>
        </div>
    </div>

    </>
}