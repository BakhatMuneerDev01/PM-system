import React, { useState } from 'react';
import {
    Elements,
    CardElement,
    useStripe,
    useElements
} from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { Button } from './ui/base';
import { CreditCard, Check } from 'lucide-react';
import api from '../api/axios';
import toast from 'react-hot-toast';

// FIXED: Use environment variable properly for React
const stripePromise = loadStripe(import.meta.env.REACT_APP_STRIPE_PUBLISHABLE_KEY);

const PaymentForm = ({ amount = 50 }) => {
    const stripe = useStripe();
    const elements = useElements();
    const [processing, setProcessing] = useState(false);
    const [succeeded, setSucceeded] = useState(false);

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (!stripe || !elements) {
            console.log('Stripe.js has not loaded yet.');
            return;
        }

        setProcessing(true);

        try {
            // Create payment intent
            const { data } = await api.post('/payments/create-payment-intent', {
                amount: amount
            });

            console.log('Payment intent created, confirming payment...');

            // Confirm payment with Stripe
            const { error, paymentIntent } = await stripe.confirmCardPayment(data.clientSecret, {
                payment_method: {
                    card: elements.getElement(CardElement),
                }
            });

            if (error) {
                console.error('Payment error:', error);
                toast.error(`Payment failed: ${error.message}`);
                setProcessing(false);
            } else if (paymentIntent.status === 'succeeded') {
                // Confirm with backend
                await api.post('/payments/confirm-payment', {
                    paymentIntentId: paymentIntent.id
                });

                setSucceeded(true);
                toast.success('Payment completed successfully!');
            }
        } catch (error) {
            console.error('Payment processing error:', error);
            toast.error('Payment failed. Please try again.');
        } finally {
            setProcessing(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div className="border rounded-lg p-4">
                <CardElement
                    options={{
                        style: {
                            base: {
                                fontSize: '16px',
                                color: '#424770',
                                '::placeholder': {
                                    color: '#aab7c4',
                                },
                            },
                        },
                    }}
                />
            </div>

            <Button
                type="submit"
                disabled={!stripe || processing || succeeded}
                variant="primary"
                className="w-full"
                icon={succeeded ? Check : CreditCard}
            >
                {processing ? 'Processing...' :
                    succeeded ? 'Payment Successful' :
                        `Pay $${amount}`}
            </Button>
        </form>
    );
};

// Export both the form and wrapper component
export const StripePaymentForm = (props) => (
    <Elements stripe={stripePromise}>
        <PaymentForm {...props} />
    </Elements>
);

export default StripePaymentForm;