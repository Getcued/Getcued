import { GradientHeadline } from "@/components/gradient-headline"
import { Subheadline } from "@/components/subheadline"
import { ChatInterface } from "@/components/chat-interface"
import { FeaturesPreview } from "@/components/features-preview"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { SpotlightEffect } from "@/components/spotlight-effect"

export default function Home() {
  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden">
      {/* Spotlight Effect */}
      <SpotlightEffect />

      {/* Header */}
      <Header />

      {/* Main Content */}
      <main className="relative z-10">
        {/* Hero Section */}
        <section className="min-h-screen flex flex-col items-center justify-center px-4 pt-20">
          <div className="text-center space-y-8 max-w-4xl mx-auto">
            <GradientHeadline />
            <Subheadline />
          </div>
        </section>

        {/* Features Section */}
        <FeaturesPreview />

        {/* Chat Interface Section */}
        <section className="py-20 px-4">
          <ChatInterface />
        </section>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  )
}
