"use client"

import { motion } from "framer-motion"
import { Mic, Brain, Clock, Zap } from "lucide-react"

const features = [
  {
    icon: Brain,
    title: "AI-Powered",
    description: "Advanced AI that understands your scene and responds naturally",
  },
  {
    icon: Clock,
    title: "24/7 Available",
    description: "Practice anytime, anywhere - your scene partner never sleeps",
  },
  {
    icon: Mic,
    title: "Voice Ready",
    description: "Natural voice interaction for realistic rehearsal sessions",
  },
  {
    icon: Zap,
    title: "Instant Feedback",
    description: "Get immediate notes and suggestions to improve your performance",
  },
]

export function FeaturesPreview() {
  return (
    <motion.section
      className="w-full max-w-4xl mx-auto px-4 py-16"
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 2 }}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {features.map((feature, index) => (
          <motion.div
            key={feature.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 2.2 + index * 0.1 }}
            className="text-center space-y-4 group"
          >
            <div className="mx-auto w-16 h-16 bg-gradient-to-br from-pink-500/20 to-purple-600/20 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-200">
              <feature.icon className="w-8 h-8 text-pink-400" />
            </div>
            <h4 className="text-lg font-semibold text-white">{feature.title}</h4>
            <p className="text-gray-400 text-sm leading-relaxed">{feature.description}</p>
          </motion.div>
        ))}
      </div>
    </motion.section>
  )
}
