"use client";
import Navbar from "../../../components/Navbar";
import Footer from "../../../components/Footer";
import { motion } from "framer-motion";
import Link from "next/link";
import { useState } from "react";
import { useSession } from "../../../lib/SessionContext";

const accountSections = [
  { id: 1, title: "Account Information", description: "Update your personal details.", href: "/account" },
  { id: 2, title: "Passwords & Security", description: "Change your password.", href: "/account/password" },
  { id: 3, title: "Order History", description: "View your past orders.", href: "/account/orders" },
];

const sectionAnimation = { initial: { opacity: 0, y: 50 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.5 } };

const Password = () => {
  const { user } = useSession();
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); setSuccess("");
    if (newPassword !== confirmPassword) { setError("New passwords do not match"); return; }
    // Password change would require a dedicated API endpoint — placeholder for now
    setSuccess("Password update requires a /api/auth/change-password endpoint to be fully wired.");
  };

  return (
    <div className="bg-[#181818] flex flex-col min-h-screen">
      <Navbar userEmail={user?.email} username={user?.username} />
      <div className="container mx-auto text-white py-8">
        <motion.h2 className="italic text-2xl text-center font-semibold mb-8" variants={sectionAnimation} initial="initial" animate="animate">Password Settings</motion.h2>
        <div className="flex flex-col md:flex-row justify-between">
          <motion.div className="bg-[#303030] p-6 rounded-lg shadow-md w-full md:w-1/4 mb-4 md:mb-0" variants={sectionAnimation} initial="initial" animate="animate">
            <h3 className="text-xl font-semibold mb-4">Account Sections</h3>
            {accountSections.map(s => (
              <div key={s.id} className="mb-4">
                <Link href={s.href} className="text-lg font-semibold hover:text-purple-500">{s.title}</Link>
                <p className="text-gray-400">{s.description}</p>
              </div>
            ))}
          </motion.div>
          <motion.div className="ml-8 bg-[#303030] p-6 rounded-lg shadow-md w-full md:w-3/4" variants={sectionAnimation} initial="initial" animate="animate">
            <h3 className="text-xl font-semibold mb-4">Change Password</h3>
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">Current Password</label>
                <input type="password" className="w-full bg-[#4e4949] text-white p-3 rounded-lg" value={currentPassword} onChange={e => setCurrentPassword(e.target.value)} required />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">New Password</label>
                <input type="password" className="w-full bg-[#4e4949] text-white p-3 rounded-lg" value={newPassword} onChange={e => setNewPassword(e.target.value)} required />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">Confirm New Password</label>
                <input type="password" className="w-full bg-[#4e4949] text-white p-3 rounded-lg" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} required />
              </div>
              {error && <p className="text-red-500 mb-4">{error}</p>}
              {success && <p className="text-green-500 mb-4">{success}</p>}
              <button type="submit" className="bg-[#71319f] text-white px-4 py-2 rounded-md">Save Changes</button>
            </form>
          </motion.div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Password;
