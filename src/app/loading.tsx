"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";

export default function Loading() {
  const [loadingText, setLoadingText] = useState("Loading");

  // Update loading text with dots animation
  useEffect(() => {
    const interval = setInterval(() => {
      setLoadingText((prev) => {
        if (prev === "Loading...") return "Loading";
        return prev + ".";
      });
    }, 500);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed inset-0 bg-gradient-to-br  flex flex-col items-center justify-center z-50">
      <div className="flex flex-col items-center">
        {/* Logo animation */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <div className="relative">
            {/* Outer spinning circle */}
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 3, ease: "linear" }}
              className="w-24 h-24 rounded-full border-4 border-t-blue-500 border-r-indigo-500 border-b-purple-500 border-l-violet-500"
            />

            {/* Inner E logo */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
            >
              <span className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                E
              </span>
            </motion.div>
          </div>
        </motion.div>

        {/* Evalify text */}
        <motion.h1
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="text-2xl md:text-3xl font-bold mb-2 bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent"
        >
          Evalify
        </motion.h1>

        {/* Loading text with animation */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="text-gray-600 dark:text-gray-300"
        >
          {loadingText}
        </motion.p>

        {/* Progress bar */}
        <motion.div
          className="h-1 bg-gray-200 dark:bg-gray-700 rounded-full w-48 mt-4 overflow-hidden"
          initial={{ width: 0, opacity: 0 }}
          animate={{ width: "12rem", opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.5 }}
        >
          <motion.div
            className="h-full bg-gradient-to-r from-blue-500 to-indigo-500"
            initial={{ width: "0%" }}
            animate={{ width: "100%" }}
            transition={{
              repeat: Infinity,
              duration: 1.5,
              ease: "easeInOut",
            }}
          />
        </motion.div>
      </div>

      {/* Footer text */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.7 }}
        transition={{ delay: 1 }}
        className="absolute bottom-6 text-xs text-gray-500 dark:text-gray-400"
      >
        Preparing your exam platform...
      </motion.p>
    </div>
  );
}
