'use client';

import { useEffect, useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { useRouter } from 'next/navigation';
import { useSearchParams } from 'next/navigation';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);

export default function CheckoutPage() {
    const [loading, setLoading] = useState(false);
    const [cartItems, setCartItems] = useState([]);
    const router = useRouter();
    const searchParams = useSearchParams();

    useEffect(() => {
        const items = searchParams.get('cartItems');
        if (items) {
            setCartItems(JSON.parse(items));
        }
    }, [searchParams]);

    const handleCheckout = async () => {
        setLoading(true);

        try {
            const response = await fetch('/api/create-checkout-session', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ items: cartItems }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                console.error('Error response from server:', errorData);
                throw new Error('Network response was not ok');
            }

            const { id } = await response.json();

            const stripe = await stripePromise;

            const { error } = await stripe.redirectToCheckout({ sessionId: id });

            if (error) {
                console.error('Stripe error:', error);
            }
        } catch (error) {
            console.error('Error:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div
        className='flex flex-col items-center justify-center h-screen w-full'
        >
            <h1 className='text-2xl font-bold'>Checkout</h1>
            <p
            className='text-center text-gray-600 mt-4 mb-8 px-4'
            >
                Click the button below to checkout. You will be redirected to the Stripe checkout page.
            </p>

            <button onClick={handleCheckout} disabled={loading || cartItems.length === 0}
            className='bg-purple-500 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded'
            >
                {loading ? 'Loading...' : 'Checkout'}
            </button>
            {cartItems.length === 0 && <p>Your cart is empty.</p>}
        </div>
    );
}
