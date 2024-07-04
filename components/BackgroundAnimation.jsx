"use client";
import React from "react";

const BackgroundAnimation = () => {
  const dotVariants = {
    initial: {
      opacity: 0.5,
    },
    animate: {
      opacity: 1,
      transition: {
        duration: 10,
        repeat: Infinity,
        ease: "linear",
      },
    },
  };

  return (
    <div className="fixed inset-0 pointer-events-none z-[-1]">
      {typeof window !== "undefined" && (
        <>
          <div
            className="absolute w-4 h-4 rounded-full bg-purple-500"
            style={{
              left: Math.random() * window.innerWidth + "px",
              top: Math.random() * window.innerHeight + "px",
            }}
          />
          <div
            className="absolute w-4 h-4 rounded-full bg-purple-500"
            style={{
              left: Math.random() * window.innerWidth + "px",
              top: Math.random() * window.innerHeight + "px",
            }}
          />
        </>
      )}
    </div>
  );
};

export default BackgroundAnimation;
