"use client"

import { motion } from "framer-motion"

export function GradientHeadline() {
  return (
    <motion.div
      className="relative"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 1, ease: "easeOut" }}
    >
      <motion.h1
        className="text-6xl md:text-8xl lg:text-9xl font-bold bg-gradient-to-r from-pink-500 via-orange-500 via-yellow-500 via-blue-500 to-purple-500 bg-clip-text text-transparent bg-[length:200%_200%]"
        animate={{
          backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
        }}
        transition={{
          duration: 8,
          ease: "linear",
          repeat: Number.POSITIVE_INFINITY,
        }}
        style={{
          backgroundImage: "linear-gradient(45deg, #ec4899, #f97316, #eab308, #3b82f6, #8b5cf6)",
          backgroundSize: "200% 200%",
        }}
      >
        Get cued.
      </motion.h1>
    </motion.div>
  )
}
