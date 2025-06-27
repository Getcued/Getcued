"use client"

import { motion } from "framer-motion"

interface VoiceVisualizerProps {
  isActive: boolean
  color?: string
}

export function VoiceVisualizer({ isActive, color = "#ec4899" }: VoiceVisualizerProps) {
  const bars = Array.from({ length: 5 }, (_, i) => i)

  return (
    <div className="flex items-center justify-center space-x-1 h-8">
      {bars.map((bar) => (
        <motion.div
          key={bar}
          className="w-1 bg-current rounded-full"
          style={{ color }}
          animate={
            isActive
              ? {
                  height: [8, 24, 8],
                  opacity: [0.4, 1, 0.4],
                }
              : {
                  height: 8,
                  opacity: 0.4,
                }
          }
          transition={{
            duration: 0.6,
            repeat: isActive ? Number.POSITIVE_INFINITY : 0,
            delay: bar * 0.1,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  )
}
