"use client"

import { motion } from "framer-motion"

export default function GradientHeadline() {
  return (
    <motion.div
      className="relative"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 1, delay: 0.5 }}
    >
      <motion.h1
        className="text-6xl md:text-8xl lg:text-9xl font-bold text-center leading-tight"
        style={{
          background: "linear-gradient(45deg, #ff006e, #ff8500, #ffb700, #8338ec, #3a86ff)",
          backgroundSize: "400% 400%",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          backgroundClip: "text",
        }}
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
    </motion.div>
  )
}
