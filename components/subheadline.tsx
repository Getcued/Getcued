"use client"

import { motion } from "framer-motion"

export function Subheadline() {
  return (
    <motion.div
      className="mt-6 md:mt-8 relative"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 1, delay: 0.5 }}
    >
      <h2 className="text-xl md:text-2xl lg:text-3xl font-medium bg-gradient-to-r from-pink-500 via-orange-400 to-purple-500 bg-clip-text text-transparent backdrop-blur-sm py-2">
        Get cast. Your 24/7 AI scene partner.
      </h2>
    </motion.div>
  )
}
