"use client";

import Navbar from "../../../components/Navbar";
import Footer from "../../../components/Footer";
import { motion } from "framer-motion";
import Link from "next/link";


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
    },
    {
        id: 4,
        title: "Redeem Code",
        description: "Enter a redeem code to get special offers.",
        href: "/account/redeem",
    },
];


const sectionAnimation = {
    initial: { opacity: 0, y: 50 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5, ease: "easeInOut" },
};


const RadeemCode = () => {
  return (
      <div
          className="bg-[#303030] flex flex-col min-h-screen"
      >
          <Navbar />
          <div className="container mx-auto text-white py-8">
              <motion.h2
                  className="text-2xl text-center text-white font-semibold mb-8 italic"
                  variants={sectionAnimation}
                  initial="initial"
                  animate="animate"
              >
                  Order History
              </motion.h2>
              <div className="flex flex-col md:flex-row justify-between">
                  <motion.div
                      className="bg-gray-900 p-6 rounded-lg shadow-md w-full md:w-1/4 mb-4 md:mb-0"
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
                      className="ml-8 bg-gray-900 p-6 rounded-lg shadow-md w-full md:w-3/4"
                      variants={sectionAnimation}
                      initial="initial"
                      animate="animate"
                  >
                      <h3 className="text-xl font-semibold mb-4">Radeem Code</h3>
                        <motion.div
                            className="bg-gray-800 p-4 rounded-lg shadow-md
                            flex flex-col gap-2
                            "
                          variants={sectionAnimation}
                          initial="initial"
                          animate="animate"
                        >
                            <h4 className="text-lg font-semibold">Enter Code</h4>
                            <input
                                type="text"
                                placeholder="Enter your code here"
                                className="p-2 bg-gray-900 text-white rounded-lg"
                            />
                            <button
                                className="bg-purple-500 text-white font-semibold p-2 rounded-lg"
                            >
                                Redeem
                          </button>
                      </motion.div>    
                  </motion.div>
              </div>
          </div>
          <Footer />
    </div>
  )
}

export default RadeemCode