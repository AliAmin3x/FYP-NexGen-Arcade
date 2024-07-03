"use client";
import React from 'react';
import { motion } from 'framer-motion';

const footerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.5, ease: 'easeInOut' },
    },
};

const linkVariants = {
    hover: { scale: 1.1, color: '#D8B4FE', transition: { duration: 0.3 } }, // purple-200
};

const Footer = () => {
    return (
        <motion.footer
            className="bg-[#303030] text-white py-6
            border-t border-purple-500 shadow-purple-400 shadow-lg
            "
            variants={footerVariants}
            initial="hidden"
            animate="visible"
        >
            <div className="container mx-auto text-center">
                <motion.p className="text-gray-400 text-sm" variants={footerVariants}>
                    © {new Date().getFullYear()} NexGen Arcade. All rights reserved.
                </motion.p>
                <div className="mt-4 flex justify-center space-x-4">
                    <motion.a
                        href="#"
                        className="text-gray-400"
                        variants={linkVariants}
                        whileHover="hover"
                    >
                        Privacy Policy
                    </motion.a>
                    <motion.a
                        href="#"
                        className="text-gray-400"
                        variants={linkVariants}
                        whileHover="hover"
                    >
                        Terms of Service
                    </motion.a>
                    <motion.a
                        href="#"
                        className="text-gray-400"
                        variants={linkVariants}
                        whileHover="hover"
                    >
                        Contact Us
                    </motion.a>
                </div>
            </div>
        </motion.footer>
    );
};

export default Footer;
