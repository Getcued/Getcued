"use client"

import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Upload, MessageCircle, Sparkles, ArrowDown } from "lucide-react"

const steps = [
  {
    number: "01",
    title: "Upload Your Script",
    description:
      "Upload any script or choose from our curated collection of classic and contemporary plays. Our AI instantly analyzes character motivations, scene dynamics, and emotional beats.",
    icon: Upload,
    features: ["Instant script analysis", "Character breakdown", "Scene identification", "Emotional mapping"],
  },
  {
    number: "02",
    title: "Start Rehearsing",
    description:
      "Begin your scene with AI as your scene partner. Practice dialogue, work on character development, or focus on specific acting techniques with real-time coaching and feedback.",
    icon: MessageCircle,
    features: ["Real-time scene partnership", "Character coaching", "Dialogue practice", "Acting technique guidance"],
  },
  {
    number: "03",
    title: "Get Personalized Feedback",
    description:
      "Receive detailed feedback on your performance, including suggestions for character choices, emotional depth, and technical improvements. Track your progress over time.",
    icon: Sparkles,
    features: ["Performance analysis", "Character development tips", "Progress tracking", "Personalized coaching"],
  },
]

export function FeaturesPreview() {
  const scrollToChat = () => {
    const chatElement = document.querySelector("[data-chat-interface]")
    if (chatElement) {
      chatElement.scrollIntoView({
        behavior: "smooth",
        block: "start",
      })
    }
  }

  return (
    <section className="py-20 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Section Header */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">How It Works</h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Get professional-level rehearsal coaching in three simple steps. Our AI understands theater, character
            development, and performance techniques.
          </p>
        </motion.div>

        {/* Steps */}
        <div className="space-y-16">
          {steps.map((step, index) => (
            <motion.div
              key={step.number}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: index * 0.2 }}
              viewport={{ once: true }}
              className={`flex flex-col ${index % 2 === 0 ? "lg:flex-row" : "lg:flex-row-reverse"} items-center gap-12`}
            >
              {/* Content */}
              <div className="flex-1 space-y-6">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-r from-pink-500 to-purple-600">
                    <step.icon className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <div className="text-sm font-mono text-pink-400 mb-1">STEP {step.number}</div>
                    <h3 className="text-2xl md:text-3xl font-bold text-white">{step.title}</h3>
                  </div>
                </div>

                <p className="text-lg text-gray-300 leading-relaxed">{step.description}</p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {step.features.map((feature, featureIndex) => (
                    <div key={featureIndex} className="flex items-center space-x-2 text-gray-400">
                      <div className="w-1.5 h-1.5 rounded-full bg-pink-400" />
                      <span className="text-sm">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Visual */}
              <div className="flex-1">
                <Card className="bg-gray-900/50 border-gray-800 overflow-hidden">
                  <CardContent className="p-8">
                    <div className="aspect-video bg-gradient-to-br from-gray-800 to-gray-900 rounded-lg flex items-center justify-center">
                      <motion.div
                        className="text-6xl"
                        animate={{
                          scale: [1, 1.1, 1],
                          rotate: [0, 5, -5, 0],
                        }}
                        transition={{
                          duration: 3,
                          repeat: Number.POSITIVE_INFINITY,
                          ease: "easeInOut",
                        }}
                      >
                        <step.icon className="w-16 h-16 text-pink-400" />
                      </motion.div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Call to Action */}
        <motion.div
          className="text-center mt-20"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          viewport={{ once: true }}
        >
          <div className="space-y-6">
            <h3 className="text-2xl md:text-3xl font-bold text-white">Ready to Start Rehearsing?</h3>
            <p className="text-lg text-gray-300 max-w-2xl mx-auto">
              Join thousands of actors who are already using Cued to improve their craft. Start your first scene in
              seconds.
            </p>

            <div className="flex flex-col items-center space-y-4">
              <Button
                onClick={scrollToChat}
                size="lg"
                className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white font-semibold px-8 py-4 text-lg rounded-full transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
              >
                Let's Get Started
                <ArrowDown className="ml-2 w-5 h-5" />
              </Button>

              <motion.div
                className="flex items-center space-x-2 text-gray-400 text-sm"
                animate={{ y: [0, 5, 0] }}
                transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
              >
                <ArrowDown className="w-4 h-4" />
                <span>Scroll down to begin your first scene</span>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
