"use client"

import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Bot, Mic, Upload, Brain, ArrowRight, Play, Users } from "lucide-react"

interface FeaturesPreviewProps {
  onGetStarted?: () => void
}

export default function FeaturesPreview({ onGetStarted }: FeaturesPreviewProps) {
  const features = [
    {
      icon: Bot,
      title: "AI Scene Partner",
      description:
        "Practice with an intelligent AI that adapts to any script, character, or scene you want to rehearse.",
    },
    {
      icon: Mic,
      title: "Voice Interaction",
      description: "Speak your lines naturally and get real-time feedback on delivery, timing, and emotional beats.",
    },
    {
      icon: Upload,
      title: "Script Upload",
      description: "Upload any script and start rehearsing immediately. Works with plays, films, and audition pieces.",
    },
    {
      icon: Brain,
      title: "Smart Feedback",
      description: "Get personalized coaching on character development, line delivery, and performance techniques.",
    },
  ]

  const steps = [
    {
      icon: Upload,
      title: "Upload Your Script",
      description: "Drop in any script or choose from our library of popular scenes and monologues.",
    },
    {
      icon: Play,
      title: "Start Rehearsing",
      description: "Begin practicing with your AI scene partner who adapts to any character or role.",
    },
    {
      icon: Users,
      title: "Get Feedback",
      description: "Receive instant coaching on delivery, timing, and character development.",
    },
  ]

  return (
    <div className="max-w-6xl mx-auto px-4">
      {/* Features Grid */}
      <motion.section
        id="features"
        className="mb-20"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
      >
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-purple-400 via-pink-400 to-orange-400 bg-clip-text text-transparent">
            Your AI Rehearsal Studio
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Practice anywhere, anytime with an AI partner that understands acting, character development, and
            performance.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <Card className="bg-gray-900/50 border-gray-700 hover:border-purple-500/50 transition-all duration-300 h-full">
                <CardContent className="p-6 text-center">
                  <motion.div
                    className="w-12 h-12 mx-auto mb-4 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center"
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    transition={{ type: "spring", stiffness: 400, damping: 10 }}
                  >
                    <feature.icon className="w-6 h-6 text-white" />
                  </motion.div>
                  <h3 className="text-lg font-semibold text-white mb-2">{feature.title}</h3>
                  <p className="text-gray-400 text-sm leading-relaxed">{feature.description}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* How It Works */}
      <motion.section
        id="how-it-works"
        className="mb-20"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
      >
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-orange-400 via-pink-400 to-purple-400 bg-clip-text text-transparent">
            How It Works
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Get started in three simple steps and transform your rehearsal process.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {steps.map((step, index) => (
            <motion.div
              key={step.title}
              className="text-center"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              viewport={{ once: true }}
            >
              <motion.div
                className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center relative"
                whileHover={{ scale: 1.1 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
              >
                <step.icon className="w-8 h-8 text-white" />
                <div className="absolute -top-2 -right-2 w-6 h-6 bg-orange-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
                  {index + 1}
                </div>
              </motion.div>
              <h3 className="text-xl font-semibold text-white mb-2">{step.title}</h3>
              <p className="text-gray-400 leading-relaxed">{step.description}</p>
            </motion.div>
          ))}
        </div>

        {/* CTA Button */}
        <motion.div
          className="text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          viewport={{ once: true }}
        >
          <Button
            onClick={onGetStarted}
            size="lg"
            className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-semibold px-8 py-4 text-lg rounded-full group"
          >
            Let's Get Started
            <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Button>
        </motion.div>
      </motion.section>
    </div>
  )
}
