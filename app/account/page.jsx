"use client";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import { motion } from "framer-motion";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useSession } from "../../lib/SessionContext";

const accountSections = [
  { id: 1, title: "Account Information", description: "Update your personal and account details.", href: "/account" },
  { id: 2, title: "Passwords & Security", description: "Change your password.", href: "/account/password" },
  { id: 3, title: "Order History", description: "View your past orders.", href: "/account/orders" },
];

const sectionAnimation = { initial: { opacity: 0, y: 50 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.5 } };

const AccountSettings = () => {
  const { user } = useSession();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");

  useEffect(() => {
    if (user) { setUsername(user.username || ""); setEmail(user.email || ""); }
  }, [user]);

  const handleSaveChanges = async (e) => {
    e.preventDefault();
    alert("Account information updated (local only — connect to API to persist).");
  };

  return (
    <div className="bg-[#181818] flex flex-col min-h-screen">
      <Navbar userEmail={user?.email} username={user?.username} />
      <div className="container mx-auto text-white py-8">
        <motion.h2 className="italic text-2xl text-center font-semibold mb-8" variants={sectionAnimation} initial="initial" animate="animate">Account Settings</motion.h2>
        <div className="flex flex-col md:flex-row justify-between">
          <motion.div className="bg-[#303030] p-6 rounded-lg shadow-md w-full md:w-1/4 mb-4 md:mb-0" variants={sectionAnimation} initial="initial" animate="animate">
            <h3 className="text-xl font-semibold mb-4">Account Settings</h3>
            {accountSections.map(s => (
              <div key={s.id} className="mb-4">
                <Link href={s.href} className="text-lg font-semibold hover:text-purple-500">{s.title}</Link>
                <p className="text-gray-400">{s.description}</p>
              </div>
            ))}
          </motion.div>
          <motion.div className="ml-8 bg-[#303030] p-4 rounded-lg shadow-md w-full md:w-3/4" variants={sectionAnimation} initial="initial" animate="animate">
            <h3 className="text-xl font-semibold mb-4">Account Information</h3>
            <form onSubmit={handleSaveChanges}>
              <label className="block mb-2">Username</label>
              <input type="text" className="w-full px-4 py-2 rounded-md bg-[#4e4949] text-white" value={username} onChange={e => setUsername(e.target.value)} />
              <label className="block mt-4 mb-2">Email</label>
              <input type="email" className="w-full px-4 py-2 rounded-md bg-[#4e4949] text-white" value={email} onChange={e => setEmail(e.target.value)} />
              <button type="submit" className="mt-4 bg-[#71319f] text-white px-4 py-2 rounded-md">Save Changes</button>
            </form>
          </motion.div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default AccountSettings;
