// pages/account/password.js
"use client";

import Navbar from "../../../components/Navbar";
import Footer from "../../../components/Footer";
import { motion } from "framer-motion";
import Link from "next/link";
import { useState, useEffect } from "react";
import { auth } from "../../../firebase";
import { signInWithEmailAndPassword, updatePassword, reauthenticateWithCredential, EmailAuthProvider } from "firebase/auth";

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

const Password = () => {
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [userEmail, setUserEmail] = useState("");

    useEffect(() => {
        const user = auth.currentUser;
        if (user) {
            setUserEmail(user.email);
        }
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setSuccess("");

        if (newPassword !== confirmPassword) {
            setError("New passwords do not match");
            return;
        }

        try {
            const user = auth.currentUser;
            const credential = EmailAuthProvider.credential(user.email, currentPassword);

            // Re-authenticate user
            await reauthenticateWithCredential(user, credential);

            // Update password
            await updatePassword(user, newPassword);
            setSuccess("Password updated successfully");
        } catch (error) {
            setError(error.message);
        }
    };

    return (
        <div className="bg-[#181818] flex flex-col min-h-screen">
            <Navbar />
            <div className="container mx-auto text-white py-8">
                <motion.h2
                    className="italic text-2xl text-center text-white font-semibold mb-8"
                    variants={sectionAnimation}
                    initial="initial"
                    animate="animate"
                >
                    Password Settings
                </motion.h2>
                <div className="flex flex-col md:flex-row justify-between">
                    <motion.div
                        className="bg-[#303030] p-6 rounded-lg shadow-md w-full md:w-1/4 mb-4 md:mb-0"
                        variants={sectionAnimation}
                        initial="initial"
                        animate="animate"
                    >
                        <h3 className="text-xl font-semibold mb-4">Account Sections</h3>
                        {accountSections.map((section) => (
                            <div key={section.id} className="mb-4">
                                <Link
                                    href={section.href}
                                    className="text-lg font-semibold hover:text-purple-500">{section.title}</Link>
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
                        <h3 className="text-xl font-semibold mb-4">Change Password</h3>
                        <form onSubmit={handleSubmit}>
                            <div className="mb-4">
                                <label htmlFor="current-password" className="block text-sm font-medium mb-2">Current Password</label>
                                <input
                                    type="password"
                                    id="current-password"
                                    name="current-password"
                                    className="w-full bg-[#4e4949] text-white p-3 rounded-lg"
                                    value={currentPassword}
                                    onChange={(e) => setCurrentPassword(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="mb-4">
                                <label htmlFor="new-password" className="block text-sm font-medium mb-2">New Password</label>
                                <input
                                    type="password"
                                    id="new-password"
                                    name="new-password"
                                    className="w-full bg-[#4e4949] text-white p-3 rounded-lg"
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="mb-4">
                                <label htmlFor="confirm-password" className="block text-sm font-medium mb-2">Confirm New Password</label>
                                <input
                                    type="password"
                                    id="confirm-password"
                                    name="confirm-password"
                                    className="w-full bg-[#4e4949] text-white p-3 rounded-lg"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    required
                                />
                            </div>
                            {error && <p className="text-red-500 mb-4">{error}</p>}
                            {success && <p className="text-green-500 mb-4">{success}</p>}
                            <button
                                type="submit"
                                className="bg-[#71319f] text-white px-4 py-2 rounded-md"
                            >
                                Save Changes
                            </button>
                        </form>
                    </motion.div>
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default Password;
