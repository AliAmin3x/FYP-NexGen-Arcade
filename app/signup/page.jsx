"use client";
import Link from "next/link";
import { motion } from "framer-motion";
import { AiOutlineUser, AiOutlineMail, AiOutlineLock } from "react-icons/ai";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "../../lib/SessionContext";

const Signup = () => {
  const router = useRouter();
  const { signup } = useSession();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");

  const handleSignUp = async (e) => {
    e.preventDefault();
    setError("");
    if (password.length < 6) { setError("Password must be at least 6 characters"); return; }
    if (password !== confirmPassword) { setError("Passwords do not match"); return; }
    try {
      await signup(username, email, password);
      router.push("/homepage");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#181818] p-4 sm:p-0">
      <motion.div className="bg-[#303030] p-6 sm:p-8 rounded-lg shadow-lg w-full max-w-xs sm:max-w-md" initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5 }}>
        <h2 className="text-xl sm:text-2xl text-white font-bold mb-4 sm:mb-6 text-center">Sign Up</h2>
        {error && <p className="text-red-500 text-sm mb-4 text-center">{error}</p>}
        <form onSubmit={handleSignUp}>
          <div className="mb-3 sm:mb-4">
            <label className="block text-gray-300 mb-1">Username</label>
            <div className="flex gap-2 sm:gap-3 items-center bg-[#4e4949] rounded-lg px-2 sm:px-3">
              <AiOutlineUser className="text-gray-400" />
              <input type="text" className="bg-transparent border-none w-full text-white py-2 focus:outline-none" required onChange={(e) => setUsername(e.target.value)} />
            </div>
          </div>
          <div className="mb-3 sm:mb-4">
            <label className="block text-gray-300 mb-1">Email</label>
            <div className="flex gap-2 sm:gap-3 items-center bg-[#4e4949] rounded-lg px-2 sm:px-3">
              <AiOutlineMail className="text-gray-400" />
              <input type="email" className="bg-transparent border-none w-full text-white py-2 focus:outline-none" required onChange={(e) => setEmail(e.target.value)} />
            </div>
          </div>
          <div className="mb-3 sm:mb-4">
            <label className="block text-gray-300 mb-1">Password</label>
            <div className="flex gap-2 sm:gap-3 items-center bg-[#4e4949] rounded-lg px-2 sm:px-3">
              <AiOutlineLock className="text-gray-400" />
              <input type="password" className="bg-transparent border-none w-full text-white py-2 focus:outline-none" required onChange={(e) => setPassword(e.target.value)} />
            </div>
          </div>
          <div className="mb-4 sm:mb-6">
            <label className="block text-gray-300 mb-1">Confirm Password</label>
            <div className="flex gap-2 sm:gap-3 items-center bg-[#4e4949] rounded-lg px-2 sm:px-3">
              <AiOutlineLock className="text-gray-400" />
              <input type="password" className="bg-transparent border-none w-full text-white py-2 focus:outline-none" required onChange={(e) => setConfirmPassword(e.target.value)} />
            </div>
          </div>
          <motion.button type="submit" className="w-full bg-[#71319f] text-white py-2 rounded-lg hover:bg-purple-600 transition-colors duration-300" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            Sign Up
          </motion.button>
        </form>
        <p className="text-gray-400 text-center mt-4">
          Already have an account?{" "}
          <Link href="/" className="text-purple-500 hover:underline">Login</Link>
        </p>
      </motion.div>
    </div>
  );
};

export default Signup;
