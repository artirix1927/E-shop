import '../css/cart.scss'


import { useMutation, useQuery } from "@apollo/client";
// import { GET_CART_BY_USER } from "../gqlQueries";
import { useCookies } from 'react-cookie';
//import { CHANGE_CART_ITEM_QUANTITY, DELETE_FROM_CART, GET_CART_BY_USER } from "../gqlQueries";
import { IsInStock } from "../main/productDetails";
import { useEffect, useState } from "react";
import { Link } from 'react-router-dom';
import { GET_CART_BY_USER} from '../gql/queries';
import { CHANGE_CART_ITEM_QUANTITY, DELETE_FROM_CART } from '../gql/mutations';


export const Cart = () => {
    const [cookies] = useCookies();
    
    const { data, loading, error } = useQuery(GET_CART_BY_USER, {variables: {id: parseInt(cookies.user.id)}, fetchPolicy: 'cache-and-network',});

    const [sum,setSum] = useState(0)
    const [selectedItems, setSelectedItems] = useState([])

    useEffect(()=>{
        if (data){
            const arr = []
            data.cartByUser.map((item) => {
                return arr.push(item)
            })
            setSelectedItems(arr)
        }
    },[data])

    useEffect(()=>{
        //setting sum state here and changing it because 
        //i use it in card copmonent and here
        let tempSum = 0
        selectedItems.map((item)=>{return tempSum+=item.product.price*item.quantity})
        setSum(tempSum)
    },[selectedItems,setSum])
    

    if (loading) return "Loading...";
    if (error) return <pre>{error.message}</pre>


    return <div className="cart-content d-flex">
        <div className='cart-items-container'>
            {
            data.cartByUser.map((item, index) => {

                return <CartItem item={item} key={index}
                                selectedItems = {selectedItems}
                                setSelectedItems={setSelectedItems}/>

                })
            }

            <h5 className="price">{sum} $CAD</h5>
        </div>

        <div>
            <SubtotalCard sum={sum} selectedItems={selectedItems}></SubtotalCard>
        </div>
                                                                
    </div>
}

const SubtotalCard = (props) => {
    const [itemsCounter, setItemsCounter] = useState(0)



    useEffect(()=>{
        //setting items counter
        let itemCounter=0;
        props.selectedItems.map((item)=>{
            return itemCounter += item.quantity
        })
        setItemsCounter(itemCounter)
    },[props.selectedItems,setItemsCounter])


    return <>
        <div className="card">
            <div className="card-body">
                <h5 className="card-title">Subtotal ({itemsCounter} items),</h5>
                <h5 className="card-title"> {props.sum} $CAD</h5>
            </div>
            <Link to='/checkout' className='btn btn-warning' state={{ selectedItems: props.selectedItems  }}>Procced to checkout</Link>
        </div>
    </>
}



export const CartItem = (props) => {
    const product = props.item.product;
    const attachments = props.item.product.attachments;

    const handleCheckboxOnClick =(e) => {
        if (!e.target.checked){
            props.setSelectedItems(props.selectedItems.filter(i => i.id !== props.item.id))
            return
        }
        props.setSelectedItems([...props.selectedItems, props.item ])
        

    }

    return <div className="cart-item">
        
        <DeleteCartItem cartItemId={props.item.id}/>

        <div className="checkbox">
            
            <input className="form-check-input" type="checkbox" value="" defaultChecked={Boolean(product.piecesLeft)} onClick={handleCheckboxOnClick}/>
            
        </div>

    
       <Link to={`/product/${props.item.product.id}`}> <img src={attachments[0].image} alt="..."/></Link>
      
         

        <div className="content" >
        
            <h5 className='price'>{product.price} $CAD</h5>
          
            <h4>{product.name}</h4>
            
            <IsInStock piecesLeft={product.piecesLeft}/>
            
            <div className="quantity">
                <QuantityDropdown piecesLeft={product.piecesLeft} deafult={props.item.quantity} cartItemId={props.item.id}
                                />
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
    <div class="modal" tabIndex="-1" id={modalId}>
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