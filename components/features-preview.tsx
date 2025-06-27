"use client"

import { motion } from "framer-motion"
import { Bot, Mic, Upload, Brain, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"

const features = [
  {
    icon: Bot,
    title: "AI Scene Partner",
    description: "Practice with an intelligent AI that adapts to any character, script, or acting style.",
  },
  {
    icon: Mic,
    title: "Voice Interaction",
    description: "Speak your lines naturally and get real-time feedback on delivery and emotion.",
  },
  {
    icon: Upload,
    title: "Script Upload",
    description: "Upload any script or choose from our curated collection of classic scenes.",
  },
  {
    icon: Brain,
    title: "Memory & Progress",
    description: "Your AI partner remembers your progress and provides personalized coaching.",
  },
]

const howItWorks = [
  {
    step: "1",
    title: "Upload Your Script",
    description: "Choose from our library or upload your own script to get started.",
  },
  {
    step: "2",
    title: "Start Rehearsing",
    description: "Practice with your AI scene partner using voice or text interaction.",
  },
  {
    step: "3",
    title: "Get Feedback",
    description: "Receive personalized coaching and track your improvement over time.",
  },
]

const scrollToChat = () => {
  const chatElement = document.querySelector("[data-chat-interface]")
  if (chatElement) {
    chatElement.scrollIntoView({ behavior: "smooth" })
  }
}

export default function FeaturesPreview() {
  return (
    <section className="py-20 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Features Grid */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-purple-400 via-pink-400 to-orange-400 bg-clip-text text-transparent">
            Your Perfect Scene Partner
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Experience the future of acting rehearsal with AI-powered coaching that adapts to your needs.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-20">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="bg-gray-900/50 backdrop-blur-sm rounded-xl p-6 border border-gray-800 hover:border-purple-500/50 transition-colors"
            >
              <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center mb-4">
                <feature.icon className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">{feature.title}</h3>
              <p className="text-gray-400">{feature.description}</p>
            </motion.div>
          ))}
        </div>

        {/* How It Works */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-orange-400 via-pink-400 to-purple-400 bg-clip-text text-transparent">
            How It Works
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Get started in three simple steps and transform your rehearsal process.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-12">
          {howItWorks.map((item, index) => (
            <motion.div
              key={item.step}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.2 }}
              viewport={{ once: true }}
              className="text-center"
            >
              <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-white">{item.step}</span>
              </div>
              <h3 className="text-2xl font-semibold text-white mb-3">{item.title}</h3>
              <p className="text-gray-400 text-lg">{item.description}</p>
            </motion.div>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center">
          <Button
            onClick={scrollToChat}
            size="lg"
            className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-8 py-4 text-lg font-semibold rounded-full transition-all duration-300 transform hover:scale-105"
          >
            Let's Get Started
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </div>
    </section>
  )
}
