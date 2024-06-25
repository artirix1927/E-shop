import { Field, Form, Formik } from "formik"

import '../css/checkout.scss'
import { Link, useLocation,  } from "react-router-dom"
import { useEffect, useState } from "react"
import { useCookies } from "react-cookie"
import { useMutation } from "@apollo/client"
import { CREATE_ORDER } from "../gql/mutations"

export const Checkout = () => {

    const [cookies] = useCookies()

    const params = useLocation()

    const selectedItems = params.state.selectedItems

    const backToCartModalId = 'back-to-cart'

    const [createOrder] = useMutation(CREATE_ORDER)

    const formOnSubmit = (values) =>{ 
        const userId = cookies.user.id
        const itemsId=[]
        selectedItems.map((item)=>itemsId.push(item.id))

        const requestData = Object.assign({user: parseInt(userId), items: JSON.stringify(itemsId)}, values)
        createOrder({variables: requestData})


    }

    return <div className="container">

        <div>
            <SummaryCard selectedItems={selectedItems} backToCartModalId={backToCartModalId}></SummaryCard>
        </div>

        <div>
            <BackToCartModal backToCartModalId={backToCartModalId}></BackToCartModal>
        </div>

        <Formik initialValues={{fullName:'', phoneNumber:'', country:'', city:'', adress:'', postalCode:''}}
        onSubmit={formOnSubmit}
        
        >
            <Form className="checkout-form">
                <Field name="fullName" className="form-control" placeholder="Full Name"></Field>
                <Field name="phoneNumber" className="form-control" placeholder="Phone Number"></Field>
                <Field name="country" className="form-control" placeholder="Country"></Field>
                <Field name="city" className="form-control" placeholder="City"></Field>
                <Field name="adress" className="form-control" placeholder="Adress, Street, Building, Unit"></Field>
                <Field name="postalCode"className="form-control"  placeholder="Postal Code"></Field>


                <button type="submit" className="btn btn-success">Order</button>
            </Form>
        </Formik>



    </div>
}

const SummaryCard = (props) => {
    const [sum,setSum] = useState(0)
    const [itemsCounter, setItemsCounter] = useState(0)

    useEffect(()=>{
        //setting sum value and items counter
        let sum=0;
        let itemCounter=0;
        props.selectedItems.map((item)=>{
            itemCounter+=item.quantity;
            return sum+=(item.product.price*item.quantity);
        })
        setItemsCounter(itemCounter)
        setSum(sum)
    }, [props.selectedItems])

    const modalIdForToggle = `#${props.backToCartModalId}`

    return <>
        <div className="card">
            <div className="card-body">
                <h5 className="card-title">Order summary:</h5>
                <h6 className="card-title" data-bs-toggle="modal" data-bs-target={modalIdForToggle}>Items: {itemsCounter}</h6>
                <h6 className="card-title">Total: {sum}</h6>
            </div>
        </div>
    </>

}


const BackToCartModal = (props) => {
    return <>
    <div className="modal" tabIndex="-1" id={props.backToCartModalId}>
            <div className="modal-dialog">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title">Want to come back to the cart?</h5>
                        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div className="modal-footer">
                        <Link to='/cart'>
                            <button  type="button" className="btn btn-primary" data-bs-dismiss="modal">Yes</button>
                        </Link>
                        
                        <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">No</button>
                    </div>
                </div>
            </div>
        </div>
    </>
}