"use client"

import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Mic, Upload, Brain, BarChart3 } from "lucide-react"

const features = [
  {
    icon: Brain,
    title: "AI Scene Partner",
    description: "Practice with an intelligent AI that adapts to any script or character",
  },
  {
    icon: Mic,
    title: "Voice Interaction",
    description: "Natural voice conversations that feel like real scene work",
  },
  {
    icon: Upload,
    title: "Script Upload",
    description: "Upload any script and start rehearsing immediately",
  },
  {
    icon: BarChart3,
    title: "Memory & Progress",
    description: "Track your progress and build on previous rehearsal sessions",
  },
]

const steps = [
  {
    number: "01",
    title: "Upload Your Script",
    description: "Simply upload any script or choose from our library of popular scenes",
  },
  {
    number: "02",
    title: "Start Rehearsing",
    description: "Practice with your AI scene partner using voice or text",
  },
  {
    number: "03",
    title: "Get Better",
    description: "Receive feedback, track progress, and perfect your performance",
  },
]

const scrollToChat = () => {
  const chatSection = document.getElementById("chat-section")
  if (chatSection) {
    chatSection.scrollIntoView({ behavior: "smooth" })
  }
}

export default function FeaturesPreview() {
  return (
    <section className="py-20 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-20">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <Card className="bg-gray-900 border-gray-800 hover:border-pink-500/50 transition-colors">
                <CardHeader>
                  <feature.icon className="h-8 w-8 text-pink-400 mb-2" />
                  <CardTitle className="text-white">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-gray-400">{feature.description}</CardDescription>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* How It Works */}
        <div className="text-center mb-16">
          <motion.h2
            className="text-4xl md:text-5xl font-bold text-white mb-4"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            How It Works
          </motion.h2>
          <motion.p
            className="text-xl text-gray-400 max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            viewport={{ once: true }}
          >
            Get started with your AI rehearsal partner in three simple steps
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {steps.map((step, index) => (
            <motion.div
              key={step.number}
              className="text-center"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              viewport={{ once: true }}
            >
              <div className="text-6xl font-bold text-pink-400 mb-4">{step.number}</div>
              <h3 className="text-2xl font-semibold text-white mb-4">{step.title}</h3>
              <p className="text-gray-400 text-lg">{step.description}</p>
            </motion.div>
          ))}
        </div>

        {/* CTA */}
        <motion.div
          className="text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <Button
            onClick={scrollToChat}
            size="lg"
            className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white px-8 py-4 text-lg font-semibold"
          >
            Let's Get Started
          </Button>
        </motion.div>
      </div>
    </section>
  )
}
