"use client"

import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Mic, MessageSquare, Upload, Sparkles, Theater, Users, Brain, ArrowDown } from "lucide-react"

const features = [
  {
    icon: MessageSquare,
    title: "AI Scene Partner",
    description: "Practice with an intelligent AI that adapts to any character, play, or scene you want to rehearse.",
    color: "from-pink-500 to-purple-600",
  },
  {
    icon: Mic,
    title: "Voice Interaction",
    description: "Speak your lines naturally and hear AI responses with realistic voice synthesis.",
    color: "from-purple-500 to-blue-600",
  },
  {
    icon: Upload,
    title: "Script Upload",
    description: "Upload your scripts and get line-by-line coaching with character insights and direction.",
    color: "from-blue-500 to-cyan-600",
  },
  {
    icon: Brain,
    title: "Memory & Progress",
    description: "AI remembers your preferences, tracks progress, and suggests personalized exercises.",
    color: "from-cyan-500 to-green-600",
  },
]

const howItWorks = [
  {
    step: "1",
    icon: Theater,
    title: "Choose Your Scene",
    description: "Select from classic plays, upload your own script, or describe what you want to rehearse.",
  },
  {
    step: "2",
    icon: Users,
    title: "Start Rehearsing",
    description: "Speak your lines naturally while AI plays other characters and provides real-time coaching.",
  },
  {
    step: "3",
    icon: Sparkles,
    title: "Get Better",
    description: "Receive personalized feedback, character insights, and suggestions to improve your performance.",
  },
]

export function FeaturesPreview() {
  const scrollToChat = () => {
    const chatElement = document.querySelector("[data-chat-interface]")
    if (chatElement) {
      chatElement.scrollIntoView({ behavior: "smooth", block: "start" })
    }
  }

  return (
    <section className="py-20 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Features Section */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Your AI-Powered Rehearsal Studio</h2>
          <p className="text-gray-300 text-lg max-w-2xl mx-auto">
            Experience the future of acting practice with intelligent coaching, voice interaction, and personalized
            feedback.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-20">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <Card className="bg-gray-900/50 border-gray-800 hover:border-gray-700 transition-all duration-300 h-full">
                <CardContent className="p-6">
                  <motion.div
                    className={`w-12 h-12 rounded-lg bg-gradient-to-r ${feature.color} flex items-center justify-center mb-4`}
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    transition={{ type: "spring", stiffness: 400, damping: 10 }}
                  >
                    <feature.icon className="w-6 h-6 text-white" />
                  </motion.div>
                  <h3 className="text-white font-semibold mb-2">{feature.title}</h3>
                  <p className="text-gray-400 text-sm leading-relaxed">{feature.description}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* How It Works Section */}
        <motion.div
          id="how-it-works"
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">How It Works</h2>
          <p className="text-gray-300 text-lg max-w-2xl mx-auto">
            Get started in three simple steps and transform your acting practice.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {howItWorks.map((step, index) => (
            <motion.div
              key={step.step}
              className="text-center"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              viewport={{ once: true }}
            >
              <motion.div
                className="relative mb-6"
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
              >
                <div className="w-20 h-20 mx-auto bg-gradient-to-r from-pink-500 to-purple-600 rounded-full flex items-center justify-center mb-4">
                  <step.icon className="w-10 h-10 text-white" />
                </div>
                <div className="absolute -top-2 -right-2 w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                  {step.step}
                </div>
              </motion.div>
              <h3 className="text-xl font-semibold text-white mb-3">{step.title}</h3>
              <p className="text-gray-400 leading-relaxed">{step.description}</p>
            </motion.div>
          ))}
        </div>

        {/* Call to Action */}
        <motion.div
          className="text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          viewport={{ once: true }}
        >
          <div className="bg-gradient-to-r from-pink-500/10 to-purple-600/10 border border-pink-500/20 rounded-2xl p-8 max-w-2xl mx-auto">
            <h3 className="text-2xl font-bold text-white mb-4">Ready to Start Rehearsing?</h3>
            <p className="text-gray-300 mb-6">
              Jump into your first scene and experience the magic of AI-powered rehearsals.
            </p>
            <Button
              onClick={scrollToChat}
              size="lg"
              className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white font-semibold px-8 py-3"
            >
              Let's Get Started
              <ArrowDown className="ml-2 w-4 h-4" />
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
