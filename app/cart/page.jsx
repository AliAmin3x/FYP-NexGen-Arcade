"use client";

import React, { useEffect, useState } from 'react';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { db, auth } from '../../firebase';
import { collection, getDocs, deleteDoc, doc, query, where } from 'firebase/firestore';
import { useRouter } from 'next/navigation';

const cardAnimation = {
    initial: { opacity: 0, y: 50 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5, ease: 'easeInOut' },
};

const headingAnimation = {
    initial: { opacity: 0, y: 50 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5, ease: 'easeInOut' },
};

const Cart = () => {
    const [cartData, setCartData] = useState([]);
    const [redeemCode, setRedeemCode] = useState('');
    const [discount, setDiscount] = useState(0);
    const [paymentMethod, setPaymentMethod] = useState('stripe'); // Default to 'stripe'
    const router = useRouter();
    const [totalAmount, setTotalAmount] = useState(0);



    const fetchCartItems = async () => {
        try {
            const user = "uhTy2V8r1vcuwYJiRTiaDEF74mv2"
           console.log("User", user);

            const cartCollectionRef = collection(db, 'cart');
            const q = query(cartCollectionRef, where('uid', '==', user));
            const querySnapshot = await getDocs(q);

            const items = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            console.log("Items", items);
            setCartData(items);
            console.log("Cart Data", cartData);

        } catch (e) {
            console.error("Error fetching cart items: ", e);
        }
    };

    useEffect(() => {
        fetchCartItems();
    }, []);

    const handleRemoveFromCart = async (id) => {
        try {
            await deleteDoc(doc(db, 'cart', id));
            setCartData(cartData.filter(item => item.id !== id));
        } catch (e) {
            console.error("Error removing document: ", e);
        }
    };

    const handleRedeem = () => {
        if (redeemCode === 'Ali20%') {
            setDiscount(0.2);
        } else {
            setDiscount(0);
            alert('Invalid Redeem Code');
        }
    };

    const handleProceedToCheckout = () => {
        let pathname;
        if (paymentMethod === 'stripe') {
            pathname = '/checkout';
        } else if (paymentMethod === 'easypaisa') {
            pathname = '/easypaisa';
        } else if (paymentMethod === 'jazzcash') {
            pathname = '/jazzcash';
        }

        const queryString = `?cartItems=${encodeURIComponent(JSON.stringify(cartData))}`;

        router.push(pathname + queryString);
    };

    console.log("Cart Data", cartData);

    useEffect(() => {
        const sum = cartData.reduce((total, item) => {
            // Check if item.price is defined and a valid number
            if (item.price && !isNaN(parseFloat(item.price))) {
                return total + parseFloat(item.price);
            }
            return total;
        }, 0);
        setTotalAmount(sum);
    }, [cartData]);
    console.log(totalAmount);

        const discountedAmount = totalAmount * (1 - discount);

    return (
        <div className='bg-[#181818] flex flex-col min-h-screen'>
            <Navbar
                userEmail={auth.currentUser ? auth.currentUser.email : null}
                username={auth.currentUser ? auth.currentUser.displayName : null}
            />
            <div className='container mx-auto text-white py-8'>
                <motion.h2 className="text-4xl text-center text-white font-semibold mb-8" {...headingAnimation}>
                    Cart
                </motion.h2>
                <motion.div className="flex flex-col items-center space-y-4" {...cardAnimation}>
                    {cartData.map((item) => (
                        <motion.div
                            key={item.id}
                            className="bg-[#303030] p-6 rounded-lg shadow-md w-full md:w-2/3 lg:w-1/2"
                            whileHover={{ scale: 1.05 }}
                            transition={{ duration: 0.3 }}
                        >
                            <div className="flex items-center">
                                <Image
                                    width={150}
                                    height={150}
                                    src={item.image}
                                    alt={item.name}
                                    className="w-32 h-32 object-cover rounded-lg"
                                />
                                <div className="ml-4">
                                    <h3 className="text-xl font-semibold">{item.name}</h3>
                                    <p className="text-purple-400 mt-2">{item.price}</p>
                                    <button
                                        className="mt-2 bg-red-500 text-white px-4 py-2 rounded-md"
                                        onClick={() => handleRemoveFromCart(item.id)}
                                    >
                                        Remove from Cart
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                    <div className="bg-[#303030] p-6 rounded-lg shadow-md w-full md:w-2/3 lg:w-1/2">
                        <p className="text-xl text-white mb-4">Your Total = {totalAmount.toFixed(2)} PKR</p>
                        {discount > 0 && (
                            <p className="text-xl text-green-500 mb-4">
                                Discounted Total = {discountedAmount.toFixed(2)} PKR
                            </p>
                        )}
                        <input
                            type="text"
                            placeholder="Your Redeem Code"
                            className="w-full px-4 py-2 mb-4 bg-[#303030] text-white rounded-md"
                            value={redeemCode}
                            onChange={(e) => setRedeemCode(e.target.value)}
                        />
                        <button
                            className="bg-[#71319f] text-white px-4 py-2 rounded-md mr-2"
                            onClick={handleRedeem}
                        >
                            Redeem
                        </button>
                        
                        <div className="mt-4">
                            <h3 className="text-xl text-white mb-2">Select Payment Method:</h3>
                            <div className="flex flex-col space-y-2">
                                <label className="flex items-center">
                                    <input
                                        type="radio"
                                        name="paymentMethod"
                                        value="stripe"
                                        checked={paymentMethod === 'stripe'}
                                        onChange={(e) => setPaymentMethod(e.target.value)}
                                        className="mr-2"
                                    />
                                    Stripe
                                </label>
                                <label className="flex items-center">
                                    <input
                                        type="radio"
                                        name="paymentMethod"
                                        value="easypaisa"
                                        checked={paymentMethod === 'easypaisa'}
                                        onChange={(e) => setPaymentMethod(e.target.value)}
                                        className="mr-2"
                                    />
                                    Easypaisa
                                </label>
                                <label className="flex items-center">
                                    <input
                                        type="radio"
                                        name="paymentMethod"
                                        value="jazzcash"
                                        checked={paymentMethod === 'jazzcash'}
                                        onChange={(e) => setPaymentMethod(e.target.value)}
                                        className="mr-2"
                                    />
                                    JazzCash
                                </label>
                            </div>
                        </div>
                        
                        <button
                            className="bg-[#71319f] text-white px-4 py-2 rounded-md mt-4"
                            onClick={handleProceedToCheckout}
                        >
                            Proceed to Checkout
                        </button>
                    </div>
                </motion.div>
            </div>
            <Footer />
        </div>
    );
};

export default Cart;
