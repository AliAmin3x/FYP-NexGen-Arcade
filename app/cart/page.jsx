"use client";
import React, { useEffect, useState } from "react";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import { motion } from "framer-motion";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useSession } from "../../lib/SessionContext";

const Cart = () => {
  const { user } = useSession();
  const [cartData, setCartData] = useState([]);
  const [redeemCode, setRedeemCode] = useState("");
  const [discount, setDiscount] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState("stripe");
  const [totalAmount, setTotalAmount] = useState(0);
  const router = useRouter();

  useEffect(() => {
    fetch("/api/cart")
      .then(r => r.json())
      .then(data => setCartData(Array.isArray(data) ? data : []))
      .catch(() => {});
  }, []);

  useEffect(() => {
    const sum = cartData.reduce((t, i) => t + (parseFloat(i.price) || 0), 0);
    setTotalAmount(sum);
  }, [cartData]);

  const handleRemoveFromCart = async (id) => {
    await fetch(`/api/cart/${id}`, { method: "DELETE" });
    setCartData(cartData.filter(i => i.id !== id));
  };

  const handleRedeem = () => {
    if (redeemCode === "Ali20%") setDiscount(0.2);
    else { setDiscount(0); alert("Invalid Redeem Code"); }
  };

  const handleProceedToCheckout = () => {
    let pathname = paymentMethod === "stripe" ? "/checkout" : paymentMethod === "easypaisa" ? "/easypaisa" : "/jazzcash";
    router.push(pathname + `?cartItems=${encodeURIComponent(JSON.stringify(cartData))}`);
  };

  const discountedAmount = totalAmount * (1 - discount);

  return (
    <div className="bg-[#181818] flex flex-col min-h-screen">
      <Navbar userEmail={user?.email} username={user?.username} />
      <div className="container mx-auto text-white py-8">
        <motion.h2 className="text-4xl text-center font-semibold mb-8" initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }}>Cart</motion.h2>
        <motion.div className="flex flex-col items-center space-y-4" initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }}>
          {cartData.map(item => (
            <motion.div key={item.id} className="bg-[#303030] p-6 rounded-lg shadow-md w-full md:w-2/3 lg:w-1/2" whileHover={{ scale: 1.05 }}>
              <div className="flex items-center">
                <Image width={150} height={150} src={item.image} alt={item.name} className="w-32 h-32 object-cover rounded-lg" />
                <div className="ml-4">
                  <h3 className="text-xl font-semibold">{item.name}</h3>
                  <p className="text-purple-400 mt-2">{item.price} PKR</p>
                  <button className="mt-2 bg-red-500 text-white px-4 py-2 rounded-md" onClick={() => handleRemoveFromCart(item.id)}>Remove from Cart</button>
                </div>
              </div>
            </motion.div>
          ))}
          <div className="bg-[#303030] p-6 rounded-lg shadow-md w-full md:w-2/3 lg:w-1/2">
            <p className="text-xl text-white mb-4">Your Total = {totalAmount.toFixed(2)} PKR</p>
            {discount > 0 && <p className="text-xl text-green-500 mb-4">Discounted Total = {discountedAmount.toFixed(2)} PKR</p>}
            <input type="text" placeholder="Your Redeem Code" className="w-full px-4 py-2 mb-4 bg-[#4e4949] text-white rounded-md" value={redeemCode} onChange={e => setRedeemCode(e.target.value)} />
            <button className="bg-[#71319f] text-white px-4 py-2 rounded-md mr-2" onClick={handleRedeem}>Redeem</button>
            <div className="mt-4">
              <h3 className="text-xl text-white mb-2">Select Payment Method:</h3>
              <div className="flex flex-col space-y-2">
                {["stripe", "easypaisa", "jazzcash"].map(m => (
                  <label key={m} className="flex items-center text-white capitalize">
                    <input type="radio" name="paymentMethod" value={m} checked={paymentMethod === m} onChange={e => setPaymentMethod(e.target.value)} className="mr-2" />
                    {m.charAt(0).toUpperCase() + m.slice(1)}
                  </label>
                ))}
              </div>
            </div>
            <button className="bg-[#71319f] text-white px-4 py-2 rounded-md mt-4" onClick={handleProceedToCheckout}>Proceed to Checkout</button>
          </div>
        </motion.div>
      </div>
      <Footer />
    </div>
  );
};

export default Cart;
