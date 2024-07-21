import '../css/cart.scss'


import { useQuery } from "@apollo/client";
import { useCookies } from 'react-cookie';

import { useEffect, useState } from "react";
import { Link } from 'react-router-dom';
import { GET_CART_BY_USER} from '../gql/queries';
import { CartItem } from './cartItem';


export const Cart = () => {
    const [cookies] = useCookies();
    
    const { data, loading, error } = useQuery(GET_CART_BY_USER, {variables: {id: parseInt(cookies.user.id)}, fetchPolicy: 'cache-and-network',});

    const [sum,setSum] = useState(0)
    const [selectedItems, setSelectedItems] = useState([])

    useEffect(()=>{
        if (data){
            const getSelectedItems = () => {
                const arr = []
                data.cartByUser.map((item) => {
                    return arr.push(item)
                })
                return arr
            }

            setSelectedItems(getSelectedItems())
        }
    },[data])

    useEffect(()=>{
        //setting sum state here and changing it because 
        //i use it in card copmonent and here
        const calculateSum = () => {
            let tempSum = 0
            selectedItems.map((item)=>{return tempSum+=item.product.price*item.quantity})
            return tempSum
        }
        setSum(calculateSum())
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
        const countItems = () => {
            let itemCounter=0;
            props.selectedItems.map((item)=>{
                return itemCounter += item.quantity
            })
            return itemCounter
        }
        
        setItemsCounter(countItems())
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


