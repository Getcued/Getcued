"use client"

import { motion } from "framer-motion"

export function GradientHeadline() {
  return (
    <motion.h1
      className="text-6xl md:text-8xl lg:text-9xl font-bold bg-gradient-to-r from-pink-500 via-orange-500 via-yellow-500 via-blue-500 to-purple-500 bg-clip-text text-transparent animate-pulse"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 1 }}
    >
      Get cued.
    </motion.h1>
  )
}
