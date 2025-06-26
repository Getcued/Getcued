import { Header } from "@/components/header"
import { LineByLineRehearsal } from "@/components/line-by-line-rehearsal"
import { MobileSidebarToggle } from "@/components/mobile-sidebar-toggle"

export default function RehearsalPage() {
  return (
    <>
      <Header />
      <MobileSidebarToggle />
      <div className="min-h-screen bg-black text-white pt-20">
        <main className="container mx-auto px-4 py-8">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-8">
              <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-pink-500 via-orange-400 to-purple-500 bg-clip-text text-transparent mb-4">
                Line-by-Line Rehearsal
              </h1>
              <p className="text-gray-300 text-lg max-w-2xl mx-auto">
                Perfect your performance with AI-powered line practice. Upload scripts, practice scenes, and get instant
                feedback.
              </p>
            </div>
            <LineByLineRehearsal />
          </div>
        </main>
      </div>
    </>
  )
}
