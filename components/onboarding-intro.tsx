"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Theater, Mic, Upload, Sparkles, ArrowRight, X, Users, BookOpen, Heart, Zap } from "lucide-react"

interface OnboardingIntroProps {
  onComplete: () => void
  onSkip: () => void
}

const features = [
  {
    icon: Theater,
    title: "Scene Partner",
    description: "Practice with an AI that adapts to any character or scene",
    color: "from-pink-500 to-rose-500",
  },
  {
    icon: Mic,
    title: "Voice Acting",
    description: "Speak your lines and hear AI responses with realistic voices",
    color: "from-purple-500 to-violet-500",
  },
  {
    icon: Upload,
    title: "Script Upload",
    description: "Upload your own scripts or choose from classic plays",
    color: "from-blue-500 to-cyan-500",
  },
  {
    icon: Sparkles,
    title: "Character Work",
    description: "Develop backstories, motivations, and emotional depth",
    color: "from-orange-500 to-yellow-500",
  },
]

const steps = [
  {
    step: 1,
    title: "Choose Your Scene",
    description: "Pick from classic plays or upload your own script",
    emoji: "🎭",
  },
  {
    step: 2,
    title: "Start Rehearsing",
    description: "Type or speak your lines - AI responds as your scene partner",
    emoji: "🎤",
  },
  {
    step: 3,
    title: "Get Feedback",
    description: "Receive coaching on character development and performance",
    emoji: "✨",
  },
]

export function OnboardingIntro({ onComplete, onSkip }: OnboardingIntroProps) {
  const [currentStep, setCurrentStep] = useState(0)

  const nextStep = () => {
    if (currentStep < 2) {
      setCurrentStep(currentStep + 1)
    } else {
      onComplete()
    }
  }

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  return (
    <motion.div
      className="fixed inset-0 bg-black/90 backdrop-blur-md z-50 flex items-center justify-center p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        className="w-full max-w-4xl"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        transition={{ type: "spring", damping: 20 }}
      >
        <Card className="bg-gray-900/95 backdrop-blur-sm border-gray-700/50 relative">
          {/* Close button */}
          <Button
            variant="ghost"
            size="sm"
            onClick={onSkip}
            className="absolute top-4 right-4 text-gray-400 hover:text-white z-10"
          >
            <X className="w-4 h-4" />
          </Button>

          <CardContent className="p-8">
            {/* Header */}
            <div className="text-center mb-8">
              <motion.div
                className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-pink-500 to-purple-600 rounded-full mb-4"
                animate={{ rotate: [0, 5, -5, 0] }}
                transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
              >
                <Theater className="w-8 h-8 text-white" />
              </motion.div>
              <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
                Welcome to{" "}
                <span className="bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent">Cued</span>
              </h1>
              <p className="text-gray-300 text-lg">Your AI-powered rehearsal partner is ready to help you shine ✨</p>
            </div>

            {/* Content Area */}
            <div className="min-h-[400px] flex flex-col justify-center">
              <AnimatePresence mode="wait">
                {currentStep === 0 && (
                  <motion.div
                    key="step-0"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                  >
                    {/* Features Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                      {features.map((feature, index) => (
                        <motion.div
                          key={feature.title}
                          className="p-6 bg-gray-800/50 rounded-lg border border-gray-700/50 hover:border-gray-600/50 transition-colors"
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.1 }}
                          whileHover={{ scale: 1.02 }}
                        >
                          <div
                            className={`inline-flex items-center justify-center w-12 h-12 bg-gradient-to-r ${feature.color} rounded-lg mb-4`}
                          >
                            <feature.icon className="w-6 h-6 text-white" />
                          </div>
                          <h3 className="text-white font-semibold mb-2">{feature.title}</h3>
                          <p className="text-gray-400 text-sm">{feature.description}</p>
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>
                )}

                {currentStep === 1 && (
                  <motion.div
                    key="step-1"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                    className="text-center mb-8"
                  >
                    <div className="mb-8">
                      <motion.div
                        className="text-6xl mb-4"
                        animate={{ scale: [1, 1.1, 1] }}
                        transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
                      >
                        🎭
                      </motion.div>
                      <h2 className="text-2xl font-bold text-white mb-4">How It Works</h2>
                      <p className="text-gray-300">Get started in three simple steps</p>
                    </div>

                    <div className="space-y-6">
                      {steps.map((step, index) => (
                        <motion.div
                          key={step.step}
                          className="flex items-center space-x-4 p-4 bg-gray-800/30 rounded-lg"
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.2 }}
                        >
                          <div className="flex-shrink-0">
                            <div className="w-12 h-12 bg-gradient-to-r from-pink-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold">
                              {step.step}
                            </div>
                          </div>
                          <div className="flex-1 text-left">
                            <h3 className="text-white font-semibold flex items-center space-x-2">
                              <span>{step.title}</span>
                              <span className="text-2xl">{step.emoji}</span>
                            </h3>
                            <p className="text-gray-400 text-sm">{step.description}</p>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>
                )}

                {currentStep === 2 && (
                  <motion.div
                    key="step-2"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                    className="text-center mb-8"
                  >
                    <motion.div
                      className="text-6xl mb-6"
                      animate={{ rotate: [0, 10, -10, 0] }}
                      transition={{ duration: 1.5, repeat: Number.POSITIVE_INFINITY }}
                    >
                      🌟
                    </motion.div>
                    <h2 className="text-2xl font-bold text-white mb-4">Ready to Begin?</h2>
                    <p className="text-gray-300 mb-6">
                      Your AI scene partner is excited to help you explore characters, practice scenes, and develop your
                      craft.
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                      <div className="p-4 bg-gradient-to-br from-pink-500/10 to-purple-600/10 rounded-lg border border-pink-500/20">
                        <Users className="w-8 h-8 text-pink-400 mx-auto mb-2" />
                        <p className="text-white font-medium">Scene Partner</p>
                        <p className="text-gray-400 text-sm">Always available</p>
                      </div>
                      <div className="p-4 bg-gradient-to-br from-blue-500/10 to-cyan-600/10 rounded-lg border border-blue-500/20">
                        <BookOpen className="w-8 h-8 text-blue-400 mx-auto mb-2" />
                        <p className="text-white font-medium">Script Library</p>
                        <p className="text-gray-400 text-sm">Classic & modern</p>
                      </div>
                      <div className="p-4 bg-gradient-to-br from-orange-500/10 to-yellow-600/10 rounded-lg border border-orange-500/20">
                        <Heart className="w-8 h-8 text-orange-400 mx-auto mb-2" />
                        <p className="text-white font-medium">Personal Growth</p>
                        <p className="text-gray-400 text-sm">Track progress</p>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Navigation */}
            <div className="flex items-center justify-between pt-6 border-t border-gray-700/50">
              <div className="flex items-center space-x-4">
                <Button variant="ghost" onClick={onSkip} className="text-gray-400 hover:text-white">
                  Skip intro
                </Button>

                {currentStep > 0 && (
                  <Button variant="ghost" onClick={prevStep} className="text-gray-400 hover:text-white">
                    Back
                  </Button>
                )}
              </div>

              <div className="flex items-center space-x-4">
                {/* Progress dots */}
                <div className="flex space-x-2">
                  {[0, 1, 2].map((step) => (
                    <motion.div
                      key={step}
                      className={`w-2 h-2 rounded-full transition-colors ${
                        step === currentStep ? "bg-pink-500" : "bg-gray-600"
                      }`}
                      animate={step === currentStep ? { scale: [1, 1.2, 1] } : {}}
                      transition={{ duration: 0.3 }}
                    />
                  ))}
                </div>

                <Button
                  onClick={nextStep}
                  className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white font-medium px-6 py-2 rounded-lg transition-all duration-200 group"
                >
                  {currentStep === 2 ? (
                    <>
                      Start Rehearsing
                      <Zap className="w-4 h-4 ml-2 group-hover:scale-110 transition-transform" />
                    </>
                  ) : (
                    <>
                      Next
                      <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-0.5 transition-transform" />
                    </>
                  )}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  )
}
