"use client";
import Link from "next/link";
import { motion } from "framer-motion";
import { AiOutlineMail, AiOutlineLock } from "react-icons/ai";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { auth } from "../../firebase";
import { signInWithEmailAndPassword } from "firebase/auth";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleSubmit = (e) => {
    e.preventDefault();

    if (email === "admin@gmail.com" && password === "admin") {
      router.push("/admin/game-approvals");
      return;
    }

    try {
      // sign in the user
      signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
          const user = userCredential.user;
          console.log(user);
          // go to homepage
          router.push("/homepage");
        })
        .catch((error) => {
          console.error(error);
        });
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#181818] p-4 sm:p-0">
      <motion.div
        className="bg-[#303030] p-6 sm:p-8 rounded-lg shadow-lg w-full max-w-xs sm:max-w-md"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <h2 className="text-xl sm:text-2xl text-white font-bold mb-4 sm:mb-6 text-center">
          Login
        </h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-3 sm:mb-4">
            <label className="block text-gray-300 mb-1" htmlFor="email">
              Email
            </label>
            <div className="flex gap-2 sm:gap-3 items-center bg-[#4e4949] rounded-lg px-2 sm:px-3">
              <AiOutlineMail className="text-gray-400" />
              <input
                type="email"
                id="email"
                className="bg-transparent border-none w-full text-white py-2 focus:outline-none"
                required
                autoComplete="off"
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>
          <div className="mb-4 sm:mb-6">
            <label className="block text-gray-300 mb-1" htmlFor="password">
              Password
            </label>
            <div className="flex gap-2 sm:gap-3 items-center bg-[#4e4949] rounded-lg px-2 sm:px-3">
              <AiOutlineLock className="text-gray-400" />
              <input
                type="password"
                id="password"
                className="bg-transparent border-none w-full text-white py-2 focus:outline-none"
                required
                autoComplete="off"
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>
          <motion.button
            type="submit"
            className="w-full bg-[#71319f] text-white py-2 rounded-lg hover:bg-purple-600 transition-colors duration-300"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Login
          </motion.button>
        </form>
        <p className="text-gray-400 text-center mt-4">
          Don&apos;t have an account?{" "}
          <Link href="/signup" className="text-purple-500 hover:underline">
            Sign Up
          </Link>
        </p>
      </motion.div>
    </div>
  );
};

export default Login;
