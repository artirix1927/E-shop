
import { CardElement, useElements, useStripe } from "@stripe/react-stripe-js";
import React, { useRef, useState } from "react";


import { useLazyQuery, useMutation } from "@apollo/client";
import { GET_PAYMENT_INTENT } from "./gql/queries";
import { SAVE_STRIPE_INFO } from "./gql/mutations";
//import ApiService from "../api";


import '../css/payment.scss'



const CheckoutForm = () => {
    const emailRef = useRef()

    const stripe = useStripe();
    const elements = useElements();


    const [paymentIntent, { data }] = useLazyQuery(GET_PAYMENT_INTENT)
    const [saveStripeInfo] = useMutation(SAVE_STRIPE_INFO)

    const handleSubmit = async (event) => {
        event.preventDefault();
        const card = elements.getElement(CardElement);

        // add these lines
        paymentIntent();
        const { paymentMethod, error } = await stripe.createPaymentMethod({
            type: 'card',
            card: card
        })
        if (paymentMethod)
            saveStripeInfo({variables:{email: emailRef.current.value,paymentMethodData: paymentMethod}})
    }


    console.log(data)
    return <div className="form-container">
        <form onSubmit={handleSubmit} className="stripe-form">
            <div className="form-row">
                <label htmlFor="email" className="form-label">Email Address</label>
                <input className="form-control" id="email" name="name" type="email" placeholder="jenny.rosen@example.com" required
                    ref={emailRef} />
            </div>

            <div className="form-row">
                <label htmlFor="card-element form-label">Credit or debit card</label>

                <CardElement id="card-element" className="form-control"/>
                <div className="card-errors" role="alert"></div>
            </div>
            <button type="submit" className="btn btn-success">
                Submit Payment
            </button>
        </form>
    </div>
    
};


export default CheckoutForm;