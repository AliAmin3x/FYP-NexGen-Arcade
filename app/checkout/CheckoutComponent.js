// /app/checkout/CheckoutComponent.tsx or .js
"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { loadStripe } from "@stripe/stripe-js";

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);

export default function CheckoutComponent() {
  const [loading, setLoading] = useState(false);
  const [cartItems, setCartItems] = useState([]);
  const searchParams = useSearchParams();

  useEffect(() => {
    const items = searchParams.get("cartItems");
    if (items) {
      try {
        setCartItems(JSON.parse(items));
      } catch (e) {
        console.error("Failed to parse cart items:", e);
      }
    }
  }, [searchParams]);

  const handleCheckout = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/create-checkout-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items: cartItems }),
      });

      if (!response.ok) throw new Error("Checkout session failed");

      const { id } = await response.json();
      const stripe = await stripePromise;
      const { error } = await stripe.redirectToCheckout({ sessionId: id });
      if (error) console.error("Stripe error:", error);
    } catch (err) {
      console.error("Checkout error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen w-full">
      <h1 className="text-2xl font-bold">Checkout</h1>
      <p className="text-center text-gray-600 mt-4 mb-8 px-4">
        Click the button below to checkout.
      </p>

      <button
        onClick={handleCheckout}
        disabled={loading || cartItems.length === 0}
        className="bg-purple-500 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded"
      >
        {loading ? "Loading..." : "Checkout"}
      </button>
      {cartItems.length === 0 && <p>Your cart is empty.</p>}
    </div>
  );
}
