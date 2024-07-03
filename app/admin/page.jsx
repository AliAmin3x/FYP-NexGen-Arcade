"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { AiOutlineUser } from 'react-icons/ai';
import Link from 'next/link';

const AdminDashboard = () => {
    return (
        <div className="min-h-screen flex flex-col bg-[#181818] text-white">
            {/* Navbar */}
            <nav className="flex items-center justify-between px-4 py-4 bg-[#303030] shadow-md">
                <div className="text-2xl font-bold italic tracking-widest text-purple-400">
                    NexGen Arcade
                </div>
                <div className="flex items-center gap-2">
                    <AiOutlineUser className="text-2xl" />
                    <span>admin@gmail.com</span>
                </div>
            </nav>

            {/* Main Content */}
            <div className="flex flex-1">
                {/* Sidebar */}
                <aside className="w-64 bg-[#303030] p-4 shadow-lg">
                    <ul className="space-y-4">
                        <li>
                            <Link href="/admin/game-approvals" passHref>
                                <motion.div
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ duration: 0.4 }}
                                    className="block py-2 px-4 rounded-lg hover:bg-[#4e4949] transition-colors duration-300"
                                >
                                    Game Approvals
                                </motion.div>
                            </Link>
                        </li>
                        <li>
                            <Link href="/admin/revenues" passHref>
                                <motion.div
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ duration: 0.4, delay: 0.2 }}
                                    className="block py-2 px-4 rounded-lg hover:bg-[#4e4949] transition-colors duration-300"
                                >
                                    Revenues
                                </motion.div>
                            </Link>
                        </li>
                    </ul>
                </aside>

                {/* Main Section */}
                <main className="flex-1 p-6">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.6 }}
                        className="text-3xl font-bold"
                    >
                        Admin Dashboard
                    </motion.div>
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="mt-4 text-gray-300"
                    >
                        Select an option from the sidebar to manage.
                    </motion.div>
                </main>
            </div>
        </div>
    );
};

export default AdminDashboard;
