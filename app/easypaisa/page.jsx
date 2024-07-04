"use client";

import React from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";

const EasyPaisaPayment = () => {
  const router = useRouter();

  const handleConfirm = (e) => {
    e.preventDefault();
    // Perform any necessary form validation or submission logic here
    router.push("/paymentreview"); // Redirect to the payment review page
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#181818] text-white">
      <h2 className="text-3xl font-bold mb-4">EasyPaisa Payment</h2>
      <div className="bg-[#303030] p-6 rounded-lg shadow-md w-full max-w-sm">
        <form onSubmit={handleConfirm}>
          <p>
            Please make payment of your purchase to our EasyPaisa Account:
            03107516474
          </p>
          <div className="mt-5">
            <label htmlFor="transaction-id" className="mb-4">
              Transaction ID:
            </label>
            <input
              type="text"
              id="transaction-id"
              name="transaction-id"
              className="w-full bg-[#4e4949] text-white p-3 focus:outline-none rounded-lg"
              placeholder="Enter Your Transaction ID"
              required
            />
          </div>
          <div className="mt-5">
            <label htmlFor="transaction-reciept" className="mb-4">
              Please Upload your Transaction receipt:
            </label>
            <input
              type="file"
              id="image"
              className="bg-transparent border-none w-full text-white py-2 focus:outline-none"
              required
            />
          </div>
          <div className="py-5">
            <motion.button
              type="submit"
              className="w-32 bg-[#71319f] text-white rounded-lg hover:bg-purple-600 transition-colors duration-300"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Confirm
            </motion.button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EasyPaisaPayment;
