
import { CardElement, useElements, useStripe } from "@stripe/react-stripe-js";
import React, { useRef, useState } from "react";


import { useLazyQuery } from "@apollo/client";
import { GET_PAYMENT_INTENT } from "./gql/queries";
//import ApiService from "../api";




const CheckoutForm = () => {
    const emailRef = useRef()

    const stripe = useStripe();
    const elements = useElements();


    const [paymentIntent, { data }] = useLazyQuery(GET_PAYMENT_INTENT)

    const handleSubmit = async (event) => {
        event.preventDefault();
        const card = elements.getElement(CardElement);

        // add these lines
        paymentIntent();
        const { paymentMethod, error } = await stripe.createPaymentMethod({
            type: 'card',
            card: card
        })
        console.log(paymentMethod,error)

    }


    console.log(data)
    return (
        <form onSubmit={handleSubmit} className="stripe-form">
            <div className="form-row">
                <label htmlFor="email">Email Address</label>
                <input className="form-input" id="email" name="name" type="email" placeholder="jenny.rosen@example.com" required
                    ref={emailRef} />
            </div>

            <div className="form-row">
                <label htmlFor="card-element">Credit or debit card</label>

                <CardElement id="card-element" />
                <div className="card-errors" role="alert"></div>
            </div>
            <button type="submit" className="submit-btn">
                Submit Payment
            </button>
        </form>
    );
};


export default CheckoutForm;