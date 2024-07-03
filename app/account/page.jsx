"use client";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import { motion } from "framer-motion";
import Link from "next/link";
import { useState, useEffect } from "react";
import { auth, getCurrentUserEmail } from "../../firebase"; // Import getCurrentUserEmail function
import { onAuthStateChanged, updateEmail } from "firebase/auth";
import { getDatabase, ref, onValue, update } from "firebase/database";

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

const AccountSettings = () => {
    const [user, setUser] = useState(null);
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [newEmail, setNewEmail] = useState("");

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                setUser(user);
                setEmail(user.email);

                const db = getDatabase();
                const userRef = ref(db, "users/" + user.uid);
                onValue(userRef, (snapshot) => {
                    const userData = snapshot.val();
                    if (userData) {
                        setUsername(userData.username);
                    }
                });
            } else {
                setUser(null);
                setUsername("");
                setEmail("");
            }
        });

        return unsubscribe;
    }, []);

    const handleUsernameChange = (e) => {
        setUsername(e.target.value);
    };

    const handleEmailChange = (e) => {
        setNewEmail(e.target.value);
    };

    const handleSaveChanges = async (e) => {
        e.preventDefault();

        try {
            // Update username in the database
            const db = getDatabase();
            const userRef = ref(db, "users/" + user.uid);
            await update(userRef, { username: username });

            // Update email
            if (user) {
                await updateEmail(user, newEmail);
                // Update the email in the database
                await update(userRef, { email: newEmail });
            }
            alert("Account information updated successfully!");
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div className="bg-[#181818] flex flex-col min-h-screen">
            <Navbar
                email={getCurrentUserEmail()}
                username={username}
            />
            <div className="container mx-auto text-white py-8">
                <motion.h2
                    className="italic text-2xl text-center text-white font-semibold mb-8"
                    variants={sectionAnimation}
                    initial="initial"
                    animate="animate"
                >
                    Account Settings
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
                                    className="text-lg font-semibold hover:text-purple-500">{section.title}</Link>
                                <p className="text-gray-400">{section.description}</p>
                            </div>
                        ))}
                    </motion.div>
                    <motion.div
                        className="ml-8 bg-[#303030] p-4 rounded-lg shadow-md w-full md:w-3/4"
                        variants={sectionAnimation}
                        initial="initial"
                        animate="animate"
                    >
                        <h3 className="text-xl font-semibold mb-4">Account Information</h3>
                        <form>
                            
                            <label className="block mb-2">Username</label>
                            <input
                                type="text"
                                className="w-full px-4 py-2 rounded-md bg-[#4e4949] text-white"
                                value={username}
                                onChange={handleUsernameChange}
                            />
                            <label className="block mt-4 mb-2">Email</label>
                            <input
                                type="email"
                                className="w-full px-4 py-2 rounded-md bg-[#4e4949] text-white"
                                value={newEmail || email}
                                onChange={handleEmailChange}
                            />
                            <button
                                type="submit"
                                className="mt-4 bg-[#71319f] text-white px-4 py-2 rounded-md"
                                onClick={handleSaveChanges}
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

export default AccountSettings;