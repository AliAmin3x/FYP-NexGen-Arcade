// pages/thankyou.js
"use client";

import React from 'react';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import { motion } from 'framer-motion';

import { auth } from '../../firebase';

const headingAnimation = {
    initial: { opacity: 0, y: 50 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5, ease: 'easeInOut' },
};

const ThankYou = () => {
    return (
        <div className='bg-[#303030] flex flex-col h-screen'>
            <Navbar
                userEmail={auth.currentUser ? auth.currentUser.email : null}
                username={auth.currentUser ? auth.currentUser.displayName : null}
            />
            <div className='flex flex-col items-center justify-center h-scrren container mx-auto text-white py-[230px]'>
                <motion.h2 className="text-4xl text-center text-white font-semibold mb-8" {...headingAnimation}>
                    Thank You for Your Order!
                </motion.h2>
                <motion.p className="text-center text-white" {...headingAnimation}>
                    Your order has been placed successfully. You will receive a confirmation email shortly.
                </motion.p>
            </div>
            <Footer />
        </div>
    );
};

export default ThankYou;
