import { useMutation} from "@apollo/client";

import { IsInStock, Quantity } from '../global_components';

import { Link } from 'react-router-dom';
import { GET_CART_BY_USER} from './gql/queries';
import { CHANGE_CART_ITEM_QUANTITY, DELETE_FROM_CART } from "./gql/mutations";






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

    
       <Link to={`/product/${props.item.product.id}`} className="image-link"> <img src={attachments[0] && attachments[0].image} alt="..."/></Link>
      
         

        <div className="content" >
        
            <h5 className='price'>{product.price} $CAD</h5>
          
            <h4 className="name">{product.name}</h4>
            
            <IsInStock piecesLeft={product.piecesLeft}/>
            
            <div className="quantity">
                <QuantityDropdown piecesLeft={product.piecesLeft} deafult={props.item.quantity} cartItemId={props.item.id}
                                />
            </div>

        </div>
    </div>
}


const QuantityDropdown = (props) => {

    const [setCartItemQuantity] = useMutation(CHANGE_CART_ITEM_QUANTITY, {refetchQueries: [
        GET_CART_BY_USER, // DocumentNode object parsed with gql
        'Cart' // Query name
      ]});

    const handleDropdownClick = (e) =>{
        setCartItemQuantity({variables: {id: parseInt(props.cartItemId), quantity: parseInt(e.target.innerText)}})

    }
    
    
    return <Quantity {...props} extendHandle={handleDropdownClick}></Quantity>
}



const DeleteCartItem = (props) => {
    const [deleteFromCart] = useMutation(DELETE_FROM_CART, {refetchQueries: [
        GET_CART_BY_USER, // DocumentNode object parsed with gql
        'Cart' // Query name
      ]});


    const modalId = `deleteModal-${props.cartItemId}`;

    return <>

    <i className="bi bi-x-lg" data-bs-toggle="modal" data-bs-target={`#${modalId}`}></i>
    <div className="modal" tabIndex="-1" id={modalId}>
        <div className="modal-dialog">
            <div className="modal-content">
                <div className="modal-header">
                    <h5 className="modal-title">Are you sure you want delete these item/s from cart?</h5>
                    <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div className="modal-footer">
                    <button type="button" className="btn btn-primary"  data-bs-dismiss="modal" onClick={
                        ()=>deleteFromCart({variables:{id: parseInt(props.cartItemId)}})
                    }>Yes</button>
                    
                    <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">No</button>
                </div>
            </div>
        </div>
    </div>

    </>
}