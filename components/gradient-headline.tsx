"use client"

import { motion } from "framer-motion"

export default function GradientHeadline() {
  return (
    <motion.h1
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      className="text-6xl md:text-8xl lg:text-9xl font-bold bg-gradient-to-r from-pink-500 via-orange-500 via-yellow-500 via-blue-500 to-purple-500 bg-clip-text text-transparent animate-pulse"
      style={{
        backgroundSize: "400% 400%",
        animation: "gradient 3s ease infinite",
      }}
    >
      Get cued.
      <style jsx>{`
        @keyframes gradient {
          0% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
          100% {
            background-position: 0% 50%;
          }
        }
      `}</style>
    </motion.h1>
  )
}
