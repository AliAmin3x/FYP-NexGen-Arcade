"use client";
import React, { useEffect, useState } from "react";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useSession } from "../../lib/SessionContext";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const PAYMENT_METHODS = [
  { id: 'stripe', label: 'Credit / Debit Card', icon: '💳', desc: 'Visa, Mastercard, Amex' },
  { id: 'easypaisa', label: 'EasyPaisa', icon: '📱', desc: 'Mobile wallet payment' },
  { id: 'jazzcash', label: 'JazzCash', icon: '📲', desc: 'Mobile wallet payment' },
];

const Cart = () => {
  const { user } = useSession();
  const [cartData, setCartData] = useState([]);
  const [redeemCode, setRedeemCode] = useState("");
  const [discount, setDiscount] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState("stripe");
  const router = useRouter();

  useEffect(() => {
    fetch("/api/cart").then(r => r.json()).then(data => setCartData(Array.isArray(data) ? data : [])).catch(() => {});
  }, []);

  const totalAmount = cartData.reduce((t, i) => t + (parseFloat(i.price) || 0), 0);
  const discountedAmount = totalAmount * (1 - discount);

  const handleRemove = async (id) => {
    await fetch(`/api/cart/${id}`, { method: "DELETE" });
    setCartData(cartData.filter(i => i.id !== id));
    toast.success("Removed from cart");
  };

  const handleRedeem = () => {
    if (redeemCode === "Ali20%") { setDiscount(0.2); toast.success("20% discount applied!"); }
    else { setDiscount(0); toast.error("Invalid redeem code"); }
  };

  const handleCheckout = () => {
    let pathname = paymentMethod === "stripe" ? "/checkout" : paymentMethod === "easypaisa" ? "/easypaisa" : "/jazzcash";
    router.push(pathname + `?cartItems=${encodeURIComponent(JSON.stringify(cartData))}`);
  };

  return (
    <div style={{background:'var(--bg-primary)', minHeight:'100vh'}}>
      <Navbar userEmail={user?.email} username={user?.username} />
      
      <div className="pt-24 pb-16 px-4 sm:px-6">
        <div className="max-w-5xl mx-auto">
          {/* Header */}
          <div className="mb-10">
            <p className="text-xs tracking-widest text-cyan-400 uppercase mb-2" style={{fontFamily:'var(--font-display)'}}>◆ Checkout</p>
            <h1 className="text-3xl font-black text-white" style={{fontFamily:'var(--font-display)'}}>Your Cart</h1>
            <p className="text-slate-400 text-sm mt-1" style={{fontFamily:'var(--font-ui)'}}>
              {cartData.length === 0 ? 'Your cart is empty' : `${cartData.length} item${cartData.length > 1 ? 's' : ''} in cart`}
            </p>
          </div>

          {cartData.length === 0 ? (
            <div className="text-center py-24">
              <p className="text-6xl mb-6">🛒</p>
              <h2 className="text-xl font-bold text-white mb-3" style={{fontFamily:'var(--font-display)'}}>Your cart is empty</h2>
              <p className="text-slate-400 mb-8 text-sm" style={{fontFamily:'var(--font-ui)'}}>Add some amazing games to get started!</p>
              <motion.button whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}
                onClick={() => router.push('/Games')} className="btn-primary px-8 py-3 text-sm">
                Browse Games
              </motion.button>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Items */}
              <div className="lg:col-span-2 space-y-3">
                <AnimatePresence>
                  {cartData.map((item) => (
                    <motion.div key={item.id} initial={{ opacity: 1 }} exit={{ opacity: 0, x: -20, height: 0 }}
                      className="game-card p-4 flex items-center gap-4">
                      <div className="relative w-20 h-14 rounded-lg overflow-hidden flex-shrink-0">
                        <Image src={item.image} alt={item.name} fill style={{ objectFit: 'cover' }} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-bold text-white truncate" style={{fontFamily:'var(--font-body)', fontSize:'0.95rem'}}>{item.name}</h3>
                        <p className="text-xs text-slate-400 mt-0.5 truncate" style={{fontFamily:'var(--font-ui)'}}>{item.description}</p>
                        <p className="text-sm font-black gradient-text-cyan mt-1" style={{fontFamily:'var(--font-display)'}}>
                          PKR {item.price}
                        </p>
                      </div>
                      <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                        onClick={() => handleRemove(item.id)}
                        className="flex-shrink-0 p-2 rounded-lg text-slate-500 hover:text-red-400 hover:bg-red-400/10 transition-all duration-200 border border-white/5 hover:border-red-400/30">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </motion.button>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>

              {/* Summary */}
              <div className="space-y-4">
                {/* Order summary */}
                <div className="game-card p-5">
                  <h3 className="font-bold text-white mb-4 text-sm" style={{fontFamily:'var(--font-display)', letterSpacing:'0.08em', textTransform:'uppercase'}}>
                    Order Summary
                  </h3>
                  <div className="space-y-2 mb-4">
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-400" style={{fontFamily:'var(--font-ui)'}}>Subtotal ({cartData.length} items)</span>
                      <span className="text-white font-semibold">PKR {totalAmount.toFixed(0)}</span>
                    </div>
                    {discount > 0 && (
                      <div className="flex justify-between text-sm">
                        <span className="text-emerald-400" style={{fontFamily:'var(--font-ui)'}}>Discount (20%)</span>
                        <span className="text-emerald-400 font-semibold">-PKR {(totalAmount * discount).toFixed(0)}</span>
                      </div>
                    )}
                  </div>
                  <div className="border-t border-white/5 pt-3 flex justify-between">
                    <span className="font-bold text-white" style={{fontFamily:'var(--font-display)'}}>Total</span>
                    <span className="font-black gradient-text-cyan text-lg" style={{fontFamily:'var(--font-display)'}}>
                      PKR {(discount > 0 ? discountedAmount : totalAmount).toFixed(0)}
                    </span>
                  </div>
                </div>

                {/* Redeem code */}
                <div className="game-card p-5">
                  <h3 className="font-bold text-white mb-3 text-sm" style={{fontFamily:'var(--font-display)', letterSpacing:'0.08em', textTransform:'uppercase'}}>
                    Promo Code
                  </h3>
                  <div className="flex gap-2">
                    <input type="text" placeholder="Enter code" value={redeemCode}
                      onChange={e => setRedeemCode(e.target.value)}
                      className="flex-1 input-gaming px-3 py-2 text-sm"
                      style={{fontFamily:'var(--font-ui)'}} />
                    <motion.button whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}
                      onClick={handleRedeem} className="btn-ghost px-4 py-2 text-xs">Apply</motion.button>
                  </div>
                </div>

                {/* Payment method */}
                <div className="game-card p-5">
                  <h3 className="font-bold text-white mb-3 text-sm" style={{fontFamily:'var(--font-display)', letterSpacing:'0.08em', textTransform:'uppercase'}}>
                    Payment Method
                  </h3>
                  <div className="space-y-2">
                    {PAYMENT_METHODS.map(m => (
                      <label key={m.id} className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all duration-200 border ${
                        paymentMethod === m.id ? 'bg-cyan-400/10 border-cyan-400/40' : 'border-white/5 hover:bg-white/5'
                      }`}>
                        <input type="radio" name="payment" value={m.id} checked={paymentMethod === m.id}
                          onChange={e => setPaymentMethod(e.target.value)} className="hidden" />
                        <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${paymentMethod === m.id ? 'border-cyan-400' : 'border-slate-600'}`}>
                          {paymentMethod === m.id && <div className="w-2 h-2 rounded-full bg-cyan-400" />}
                        </div>
                        <span className="text-xl">{m.icon}</span>
                        <div>
                          <p className="text-sm font-semibold text-white" style={{fontFamily:'var(--font-body)'}}>{m.label}</p>
                          <p className="text-xs text-slate-400" style={{fontFamily:'var(--font-ui)'}}>{m.desc}</p>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>

                <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
                  onClick={handleCheckout}
                  className="w-full btn-primary py-4 text-sm font-bold flex items-center justify-center gap-2">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                  Proceed to Checkout
                </motion.button>
              </div>
            </div>
          )}
        </div>
      </div>

      <Footer />
      <ToastContainer position="bottom-right" autoClose={3000} theme="dark"
        toastStyle={{ background: 'var(--bg-card)', border: '1px solid rgba(0,212,255,0.2)', fontFamily: 'var(--font-body)' }} />
    </div>
  );
};

export default Cart;
