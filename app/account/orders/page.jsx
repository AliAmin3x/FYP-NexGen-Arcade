"use client";

import React, { useEffect, useState } from 'react';
import Navbar from "../../../components/Navbar";
import Footer from "../../../components/Footer";
import { motion } from "framer-motion";
import Link from "next/link";
import { db, auth } from "../../../firebase";
import { collection, query, where, getDocs, onSnapshot } from "firebase/firestore";

const accountSections = [
    {
        id: 1,
        title: "Account Information",
        description: "Update your personal and account details.",
        href: "/account",
    },
    {
        id: 2,
        title: "Passwords & Security",
        description: "Change your password and manage security settings.",
        href: "/account/password",
    },
    {
        id: 3,
        title: "Order History",
        description: "View your past orders and their status.",
        href: "/account/orders",
    }
];

const sectionAnimation = {
    initial: { opacity: 0, y: 50 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5, ease: "easeInOut" },
};

const Orders = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged(async (user) => {
            if (user) {
                try {
                    const ordersCollectionRef = collection(db, 'orders');
                    const q = query(ordersCollectionRef, where('uid', '==', user.uid));

                    // Using onSnapshot to listen for real-time updates
                    const unsubscribeSnapshot = onSnapshot(q, (querySnapshot) => {
                        const fetchedOrders = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                        setOrders(fetchedOrders);
                        setLoading(false);
                    });

                    // Cleanup listener on unmount
                    return () => unsubscribeSnapshot();
                } catch (e) {
                    console.error("Error fetching orders: ", e);
                    setLoading(false);
                }
            } else {
                setOrders([]);
                setLoading(false);
            }
        });

        // Cleanup listener on unmount
        return () => unsubscribe();
    }, []);

    if (loading) {
        return (
            <div className="bg-[#181818] flex flex-col min-h-screen justify-center items-center text-white">
                <p>Loading...</p>
            </div>
        );
    }

    return (
        <div className="bg-[#181818] flex flex-col min-h-screen">
            <Navbar
                userEmail={auth.currentUser ? auth.currentUser.email : null}
                username={auth.currentUser ? auth.currentUser.displayName : null}
            />
            <div className="container mx-auto text-white py-8">
                <motion.h2
                    className="text-2xl text-center text-white font-semibold mb-8 italic"
                    variants={sectionAnimation}
                    initial="initial"
                    animate="animate"
                >
                    Order History
                </motion.h2>
                <div className="flex flex-col md:flex-row justify-between">
                    <motion.div
                        className="bg-[#303030] p-6 rounded-lg shadow-md w-full md:w-1/4 mb-4 md:mb-0"
                        variants={sectionAnimation}
                        initial="initial"
                        animate="animate"
                    >
                        <h3 className="text-xl font-semibold mb-4">Account Settings</h3>
                        {accountSections.map((section) => (
                            <div key={section.id} className="mb-4">
                                <Link
                                    href={section.href}
                                    className="text-lg font-semibold hover:text-purple-500"
                                >
                                    {section.title}
                                </Link>
                                <p className="text-gray-400">{section.description}</p>
                            </div>
                        ))}
                    </motion.div>
                    <motion.div
                        className="ml-8 bg-[#303030] p-6 rounded-lg shadow-md w-full md:w-3/4"
                        variants={sectionAnimation}
                        initial="initial"
                        animate="animate"
                    >
                        <h3 className="text-xl font-semibold mb-4">Order History</h3>
                        {orders.length > 0 ? (
                            orders.map((order) => (
                                <div key={order.id} className="mb-4 bg-gray-800 p-4 rounded-lg shadow-md flex flex-col gap-2">
                                    <h4 className="text-lg font-semibold">{order.game}</h4>
                                    <p className="text-md font-medium">${order.price}</p>
                                    <p className="text-sm">{order.description}</p>
                                </div>
                            ))
                        ) : (
                            <p>No orders found.</p>
                        )}
                    </motion.div>
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default Orders;
