"use client"

import { motion } from "framer-motion"
import { Users, Clock, Zap, Award } from "lucide-react"

const stats = [
  {
    icon: Users,
    number: "10K+",
    label: "Actors on Waitlist",
  },
  {
    icon: Clock,
    number: "24/7",
    label: "Always Available",
  },
  {
    icon: Zap,
    number: "< 1s",
    label: "Response Time",
  },
  {
    icon: Award,
    number: "99%",
    label: "Satisfaction Rate",
  },
]

export function StatsSection() {
  return (
    <motion.section
      className="w-full max-w-4xl mx-auto px-4 py-16"
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 3.5 }}
    >
      <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 3.7 + index * 0.1, type: "spring", stiffness: 200 }}
            className="text-center space-y-3"
          >
            <div className="mx-auto w-16 h-16 bg-gradient-to-br from-pink-500/20 to-purple-600/20 rounded-full flex items-center justify-center">
              <stat.icon className="w-8 h-8 text-pink-400" />
            </div>
            <div className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent">
              {stat.number}
            </div>
            <p className="text-gray-400 text-sm">{stat.label}</p>
          </motion.div>
        ))}
      </div>
    </motion.section>
  )
}
