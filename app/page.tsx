import { GradientHeadline } from "@/components/gradient-headline"
import { Header } from "@/components/header"
import { FeaturesPreview } from "@/components/features-preview"
import ChatInterface from "@/components/chat-interface"
import { Footer } from "@/components/footer"

export default function HomePage() {
  const scrollToChat = () => {
    const chatElement = document.querySelector("[data-chat-interface]")
    if (chatElement) {
      chatElement.scrollIntoView({ behavior: "smooth" })
    }
  }

  return (
    <div className="min-h-screen bg-black text-white overflow-x-hidden">
      <Header />

      {/* Hero Section */}
      <section className="relative min-h-screen flex flex-col items-center justify-center px-4 py-20">
        <div className="text-center space-y-8 max-w-4xl mx-auto">
          <GradientHeadline />

          <div className="space-y-4">
            <h2 className="text-xl md:text-2xl text-gray-300 font-light">Get cast.</h2>
            <p className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto leading-relaxed">
              Your 24/7 AI scene partner.
            </p>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <FeaturesPreview onGetStarted={scrollToChat} />
      </section>

      {/* Chat Interface */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <ChatInterface />
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  )
}
