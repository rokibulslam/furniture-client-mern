import { CardElement, useElements, useStripe } from '@stripe/react-stripe-js';
import React, { useState } from 'react'
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import useAuth from '../../../Hooks/useAuth';
import { createOrder } from '../../../Redux/actions/cartAction';



const CheckoutForm = () => {
  const [cardError, setCardError] = useState('');
  const [clientSecret, setClientSecret] = useState('');
  const [processing, setProcessing]=useState(false)
  const dispatch = useDispatch();
  const { user } = useAuth();
  const price = useSelector((state) => state.cart.grandTotal);
  const shippingAdress = useSelector(state => state.cart.shippingAdress)
  const cart = useSelector(state=>state.cart)
  
  const stripe = useStripe();
  const elements = useElements();
  // Create PaymentIntent as soon as the page Loads 
  try {
    
  } catch (err) {
    
  }
  useEffect(() => {
    fetch("http://localhost:5000/payment-intent", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ price }),
    })
      .then((res) => res.json())
      .then((data) => setClientSecret(data?.clientSecret))
      .catch((err) => setCardError("Server Error Please Try Again"));
  }, [price])
  console.log(clientSecret);
  const handleSubmit = async (event) => {
      
        event.preventDefault();
          if (!stripe || !elements) {
            return;
          }
          const card = elements.getElement(CardElement);
          if (card === null) {
            return;
          }
         const { error, paymentMethod } = await stripe.createPaymentMethod({
           type: "card",
           card,
         });
        if (error) {
          console.log(error)
          setCardError(error)
        }
        else {
          setCardError('')
        }
    setProcessing(true)
         const { paymentIntent, error: confirmError } =
           await stripe.confirmCardPayment(
             clientSecret,
             {payment_method: {
               card: card,
               billing_details: {
                 name: shippingAdress.name,
                 email: shippingAdress.email,
               },
             },
           });
      if (confirmError) {
        setCardError(confirmError)
        return;
      }
      else {
        setCardError('')
    }
      if (paymentIntent.status === "succeeded") {
        const orderDetails = {
          ...cart,
          status: "Pending",
          userEmail: user.email,
          transactionId: paymentIntent.id,
        };
        dispatch(createOrder(orderDetails))
      }
    setProcessing(false)
  }
  console.log(cardError);
  return (
    <div>
        <p>You Have To Pay $ {price.grandTotal}</p>
      <p style={{ color: "red" }}>{}</p>
      <form onSubmit={handleSubmit}>
        <CardElement />
        <button type="submit" disabled={!stripe || !elements || processing}>
          Pay
        </button>
      </form>
    </div>
  );
}

export default CheckoutForm