import GradientHeadline from "@/components/gradient-headline"
import Header from "@/components/header"
import FeaturesPreview from "@/components/features-preview"
import ChatInterface from "@/components/chat-interface"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-black text-white">
      <Header />

      {/* Hero Section */}
      <section className="flex flex-col items-center justify-center min-h-screen px-4 text-center">
        <div className="max-w-4xl mx-auto space-y-8">
          <GradientHeadline />
          <p className="text-xl md:text-2xl text-gray-300 font-light">Get cast. Your 24/7 AI scene partner.</p>
        </div>
      </section>

      {/* Features Section */}
      <FeaturesPreview />

      {/* Chat Interface Section */}
      <section id="chat-section" className="py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <ChatInterface />
        </div>
      </section>
    </div>
  )
}
