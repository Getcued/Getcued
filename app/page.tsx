"use client"

import { GradientHeadline } from "@/components/gradient-headline"
import { Subheadline } from "@/components/subheadline"
import { ChatInterface } from "@/components/chat-interface"
import { FeaturesPreview } from "@/components/features-preview"
import { TestimonialsSection } from "@/components/testimonials-section"
import { StatsSection } from "@/components/stats-section"
import { ComingSoonSection } from "@/components/coming-soon-section"
import { Footer } from "@/components/footer"
import { Header } from "@/components/header"

export default function Home() {
  const scrollToChat = () => {
    const chatElement = document.querySelector("[data-chat-interface]")
    if (chatElement) {
      chatElement.scrollIntoView({ behavior: "smooth" })
    }
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <Header />

      {/* Hero Section */}
      <section className="relative min-h-screen flex flex-col items-center justify-center px-4 py-20">
        <div className="text-center space-y-8 max-w-4xl mx-auto">
          <GradientHeadline />
          <Subheadline />

          {/* How It Works Section */}
          <div className="mt-16 space-y-12">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-8">How It Works</h2>

            <div className="grid md:grid-cols-3 gap-8 text-left">
              <div className="space-y-4">
                <div className="w-12 h-12 bg-gradient-to-r from-pink-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-xl">
                  1
                </div>
                <h3 className="text-xl font-semibold text-white">Choose Your Scene</h3>
                <p className="text-gray-300 leading-relaxed">
                  Select from classic Shakespeare, modern drama, or upload your own script. Our AI understands hundreds
                  of plays and can adapt to any material you bring.
                </p>
                <ul className="text-sm text-gray-400 space-y-1">
                  <li>• Shakespeare classics (Hamlet, Romeo & Juliet, Macbeth)</li>
                  <li>• Modern American drama (Streetcar, Death of a Salesman)</li>
                  <li>• Contemporary works and original scripts</li>
                  <li>• Monologues, dialogues, and full scenes</li>
                </ul>
              </div>

              <div className="space-y-4">
                <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-blue-600 rounded-full flex items-center justify-center text-white font-bold text-xl">
                  2
                </div>
                <h3 className="text-xl font-semibold text-white">Rehearse Together</h3>
                <p className="text-gray-300 leading-relaxed">
                  Practice with an AI that understands character motivation, subtext, and emotional beats. Get real-time
                  feedback on your delivery, pacing, and character choices.
                </p>
                <ul className="text-sm text-gray-400 space-y-1">
                  <li>• AI plays opposite characters authentically</li>
                  <li>• Real-time coaching and direction</li>
                  <li>• Character development exercises</li>
                  <li>• Voice and diction guidance</li>
                </ul>
              </div>

              <div className="space-y-4">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-green-600 rounded-full flex items-center justify-center text-white font-bold text-xl">
                  3
                </div>
                <h3 className="text-xl font-semibold text-white">Perfect Your Craft</h3>
                <p className="text-gray-300 leading-relaxed">
                  Receive personalized coaching that adapts to your skill level and style. Build confidence, explore new
                  interpretations, and prepare for auditions.
                </p>
                <ul className="text-sm text-gray-400 space-y-1">
                  <li>• Personalized feedback and suggestions</li>
                  <li>• Audition preparation and practice</li>
                  <li>• Character analysis and backstory development</li>
                  <li>• Performance technique refinement</li>
                </ul>
              </div>
            </div>

            {/* Call to Action */}
            <div className="text-center mt-12">
              <button
                onClick={scrollToChat}
                className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white font-semibold px-8 py-4 rounded-full text-lg transition-all duration-200 transform hover:scale-105 shadow-lg"
              >
                Let's Get Started →
              </button>
              <p className="text-gray-400 text-sm mt-4">Start your first rehearsal session below</p>
            </div>
          </div>
        </div>
      </section>

      {/* Chat Interface */}
      <section className="py-20">
        <ChatInterface />
      </section>

      {/* Additional Sections */}
      <FeaturesPreview />
      <TestimonialsSection />
      <StatsSection />
      <ComingSoonSection />
      <Footer />
    </div>
  )
}
