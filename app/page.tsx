"use client"

import { useEffect } from "react"
import Header from "@/components/header"
import GradientHeadline from "@/components/gradient-headline"
import FeaturesPreview from "@/components/features-preview"
import ChatInterface from "@/components/chat-interface"

export default function HomePage() {
  useEffect(() => {
    // Smooth scroll behavior for the entire page
    document.documentElement.style.scrollBehavior = "smooth"

    return () => {
      document.documentElement.style.scrollBehavior = "auto"
    }
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-purple-950/20 to-black">
      <Header />

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <GradientHeadline />
          <p className="text-xl md:text-2xl text-gray-300 mb-12 max-w-2xl mx-auto leading-relaxed">
            Get cast. Your 24/7 AI scene partner.
          </p>
        </div>
      </section>

      {/* Features Section */}
      <FeaturesPreview />

      {/* Chat Interface Section */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-purple-400 via-pink-400 to-orange-400 bg-clip-text text-transparent">
              Start Rehearsing Now
            </h2>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Your AI scene partner is ready. Upload a script or choose from our suggestions to begin.
            </p>
          </div>
          <ChatInterface />
        </div>
      </section>
    </div>
  )
}
