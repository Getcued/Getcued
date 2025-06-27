"use client"

import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Bot, Mic, Upload, Brain, ArrowRight, Play, Zap } from "lucide-react"

interface FeaturesPreviewProps {
  onGetStarted: () => void
}

export function FeaturesPreview({ onGetStarted }: FeaturesPreviewProps) {
  const features = [
    {
      icon: Bot,
      title: "AI Scene Partner",
      description:
        "Practice with an intelligent AI that adapts to any script, character, or scene you want to rehearse.",
      color: "from-pink-500 to-rose-500",
    },
    {
      icon: Mic,
      title: "Voice Interaction",
      description: "Speak your lines naturally and get real-time feedback on delivery, timing, and emotional depth.",
      color: "from-purple-500 to-indigo-500",
    },
    {
      icon: Upload,
      title: "Script Upload",
      description: "Upload any script and instantly start rehearsing. From Shakespeare to contemporary works.",
      color: "from-blue-500 to-cyan-500",
    },
    {
      icon: Brain,
      title: "Memory & Progress",
      description: "Track your improvement over time with personalized insights and performance analytics.",
      color: "from-orange-500 to-yellow-500",
    },
  ]

  const steps = [
    {
      icon: Upload,
      title: "Upload Your Script",
      description: "Drop in any script or choose from our library of classics",
    },
    {
      icon: Play,
      title: "Start Rehearsing",
      description: "Practice scenes with your AI partner in real-time",
    },
    {
      icon: Zap,
      title: "Get Feedback",
      description: "Receive instant coaching on delivery and performance",
    },
  ]

  return (
    <div className="max-w-6xl mx-auto px-4 space-y-20">
      {/* Features Grid */}
      <motion.div
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
      >
        {features.map((feature, index) => (
          <motion.div
            key={feature.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 * index }}
          >
            <Card className="bg-gray-900/50 border-gray-800 hover:border-gray-700 transition-all duration-300 group h-full">
              <CardContent className="p-6 text-center space-y-4">
                <motion.div
                  className={`w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br ${feature.color} flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}
                  whileHover={{ rotate: 5 }}
                >
                  <feature.icon className="w-8 h-8 text-white" />
                </motion.div>
                <h3 className="text-xl font-semibold text-white">{feature.title}</h3>
                <p className="text-gray-400 leading-relaxed">{feature.description}</p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </motion.div>

      {/* How It Works */}
      <motion.div
        className="text-center space-y-12"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.4 }}
      >
        <div className="space-y-4">
          <h2 className="text-3xl md:text-4xl font-bold text-white">How It Works</h2>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Get started in three simple steps and transform your rehearsal process
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          {steps.map((step, index) => (
            <motion.div
              key={step.title}
              className="relative"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 + 0.1 * index }}
            >
              <div className="text-center space-y-4">
                <div className="relative">
                  <div className="w-20 h-20 mx-auto bg-gradient-to-br from-pink-500 to-purple-600 rounded-full flex items-center justify-center">
                    <step.icon className="w-10 h-10 text-white" />
                  </div>
                  <div className="absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-br from-orange-500 to-pink-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                    {index + 1}
                  </div>
                </div>
                <h3 className="text-xl font-semibold text-white">{step.title}</h3>
                <p className="text-gray-400">{step.description}</p>
              </div>

              {index < steps.length - 1 && (
                <div className="hidden md:block absolute top-10 left-full w-full">
                  <ArrowRight className="w-6 h-6 text-gray-600 mx-auto" />
                </div>
              )}
            </motion.div>
          ))}
        </div>

        <motion.div
          className="pt-8"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.8 }}
        >
          <Button
            onClick={onGetStarted}
            size="lg"
            className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white font-semibold px-8 py-4 rounded-full text-lg shadow-lg hover:shadow-xl transition-all duration-300 group"
          >
            Let's Get Started
            <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Button>
        </motion.div>
      </motion.div>
    </div>
  )
}
