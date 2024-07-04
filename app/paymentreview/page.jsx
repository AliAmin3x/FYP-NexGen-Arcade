// File: app/paymentreview/page.jsx

"use client"; // Mark this file as a Client Component

import React from "react";
import { useRouter } from "next/navigation"; // Import from 'next/navigation'

const PaymentReview = () => {
  const router = useRouter();

  const handleReturnHome = () => {
    router.push("/homepage"); // Redirect to the homepage
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#181818] text-white">
      <h2 className="text-3xl font-bold mb-4">
        We are reviewing your payment, which will take approximately 12-24
        hours. Thank you for your patience.
      </h2>
      <div className="py-5">
        <button
          type="button" // Ensure type is "button" for non-form buttons
          className="w-32 bg-[#71319f] text-white font-bold py-2 px-4 border rounded hover:bg-purple-600 transition-colors duration-300"
          onClick={handleReturnHome} // Call function on button click
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Return to Home Page
        </button>
      </div>
    </div>
  );
};

export default PaymentReview;
