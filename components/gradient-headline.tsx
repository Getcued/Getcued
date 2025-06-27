"use client"

import { motion } from "framer-motion"

export default function GradientHeadline() {
  return (
    <motion.div
      className="relative"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 1, delay: 0.2 }}
    >
      <motion.h1
        className="text-6xl md:text-8xl lg:text-9xl font-bold text-center mb-8 bg-gradient-to-r from-purple-400 via-pink-400 via-orange-400 via-yellow-400 via-blue-400 to-purple-400 bg-clip-text text-transparent animate-gradient bg-[length:400%_400%]"
        animate={{
          backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
        }}
        transition={{
          duration: 8,
          repeat: Number.POSITIVE_INFINITY,
          ease: "linear",
        }}
      >
        Get cued.
      </motion.h1>

      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-purple-400/20 via-pink-400/20 to-orange-400/20 blur-3xl -z-10"
        animate={{
          scale: [1, 1.1, 1],
          opacity: [0.3, 0.6, 0.3],
        }}
        transition={{
          duration: 4,
          repeat: Number.POSITIVE_INFINITY,
          ease: "easeInOut",
        }}
      />
    </motion.div>
  )
}
