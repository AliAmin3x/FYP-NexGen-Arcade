"use client";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { useState, useEffect, useRef } from "react";
import {
  AiOutlineShoppingCart,
  AiOutlineHeart,
  AiOutlineUser,
} from "react-icons/ai";
import { FaUserCircle, FaSignOutAlt, FaUserPlus, FaCog } from "react-icons/fa";

const CustomLink = ({ href, children }) => {
  return (
    <motion.a
      href={href}
      className="relative text-white font-semibold text-base sm:text-lg"
      whileHover={{ scaleX: 1.1 }}
    >
      {children}
      <motion.div
        className="absolute bottom-0 left-0 w-full h-0.5 bg-purple-500 rounded-lg"
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ duration: 0.4, ease: "easeInOut" }}
      />
    </motion.a>
  );
};

const AnimatedText = ({ text }) => {
  const letters = text.split("");

  return (
    <div className="hidden sm:block text-white font-bold text-lg sm:text-xl">
      {letters.map((letter, index) => (
        <motion.span
          key={index}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4, delay: index * 0.1 }}
        >
          {letter}
        </motion.span>
      ))}
    </div>
  );
};

const Navbar = ({ userEmail, username }) => {
  const [showPopup, setShowPopup] = useState(false);
  const popupRef = useRef(null);

  const handleTogglePopup = () => {
    setShowPopup(!showPopup);
  };

  const handleClickOutside = (event) => {
    if (popupRef.current && !popupRef.current.contains(event.target)) {
      setShowPopup(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="z-50 sticky top-0 left-0 shadow-sm shadow-purple-400 w-full h-16 sm:h-20 bg-[#303030] flex justify-between items-center px-3 sm:px-4">
      {/* Logo */}
      <Link href="/homepage" className="cursor-pointer">
        <div className="flex justify-center items-center gap-2 sm:gap-3">
          <Image
            src="/logo.png"
            alt="logo"
            width={30}
            height={30}
            className="sm:w-10 sm:h-10"
          />
          <AnimatedText text="NexGen Arcade" />
        </div>
      </Link>

      {/* Navbar */}
      <div className="flex gap-6 sm:gap-8">
        <CustomLink href="/homepage">Store</CustomLink>
        <CustomLink href="/library">Library</CustomLink>
        <CustomLink href="/Games">Explore</CustomLink>
      </div>

      {/* Profile */}
      <div className="flex gap-4 sm:gap-6 items-center relative">
        <motion.span
          whileHover={{ scale: 1.1 }}
          onClick={handleTogglePopup}
          className="cursor-pointer"
        >
          <AiOutlineUser
            size={20}
            className="text-white hover:text-purple-500 transition-colors duration-300 sm:text-2xl"
          />
        </motion.span>
        <Link href="/favorite">
          <motion.span whileHover={{ scale: 1.1 }}>
            <AiOutlineHeart
              size={20}
              className="text-white hover:text-purple-500 transition-colors duration-300 sm:text-2xl"
            />
          </motion.span>
        </Link>
        <Link href="/cart">
          <motion.span whileHover={{ scale: 1.1 }}>
            <AiOutlineShoppingCart
              size={20}
              className="text-white hover:text-purple-500 transition-colors duration-300 sm:text-2xl"
            />
          </motion.span>
        </Link>

        {showPopup && (
          <motion.div
            ref={popupRef}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="absolute top-12 right-0 w-48 sm:w-64 bg-[#404040] text-white shadow-lg rounded-lg p-3 sm:p-4"
          >
            <div className="flex items-center gap-2">
              <FaUserCircle size={18} className="text-purple-500 sm:text-xl" />
              <div>
                <p className="font-semibold text-sm sm:text-base">{username}</p>
                <p className="text-xs sm:text-sm text-gray-400">{userEmail}</p>
              </div>
            </div>
            <hr className="my-1 sm:my-2 border-gray-600" />
            <div className="flex flex-col gap-1 sm:gap-2">
              <Link
                href="/account"
                className="flex items-center gap-1 sm:gap-2 hover:text-purple-500 bg-[#505050] rounded-lg p-1 sm:p-2"
              >
                <FaCog size={14} className="sm:text-lg" />
                Account
              </Link>
              <Link
                href="/developer/signup"
                className="flex items-center gap-1 sm:gap-2 hover:text-purple-500 bg-[#505050] rounded-lg p-1 sm:p-2"
              >
                <FaUserPlus size={14} className="sm:text-lg" />
                Sign Up as Developer
              </Link>
              <Link
                href="/"
                className="flex items-center gap-1 sm:gap-2 hover:text-purple-500 bg-[#505050] rounded-lg p-1 sm:p-2"
              >
                <FaSignOutAlt size={14} className="sm:text-lg" />
                Log Out
              </Link>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default Navbar;
