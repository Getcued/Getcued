"use client"

import { useState } from "react"
import { Header } from "@/components/header"
import { GradientHeadline } from "@/components/gradient-headline"
import { Subheadline } from "@/components/subheadline"
import { SpotlightEffect } from "@/components/spotlight-effect"
import { PageWrapper } from "@/components/page-wrapper"
import { ChatInterface } from "@/components/chat-interface"
import { ConversationsSidebar } from "@/components/conversations-sidebar"
import { MobileSidebarToggle } from "@/components/mobile-sidebar-toggle"
import { ComingSoonSection } from "@/components/coming-soon-section"
import { FeaturesPreview } from "@/components/features-preview"
import { Footer } from "@/components/footer"
import { useConversations } from "@/hooks/use-conversations"

export default function Home() {
  const [showConversationsSidebar, setShowConversationsSidebar] = useState(false)

  const {
    conversations,
    currentConversationId,
    switchToConversation,
    startNewConversation,
    deleteConversation,
    renameConversation,
    clearAllConversations,
  } = useConversations()

  const hasConversations = conversations.length > 0
  const hasActiveConversation = currentConversationId !== null

  const handleConversationStart = () => {
    setShowConversationsSidebar(true)
  }

  const handleGetStarted = () => {
    // This will be called when the "Start Your First Scene" button is clicked
    // The actual scrolling is handled in the FeaturesPreview component
  }

  return (
    <>
      <Header />
      <MobileSidebarToggle />
      <div className="flex min-h-screen bg-black text-white">
        {/* Conversations Sidebar - Show when there are conversations */}
        {(hasConversations || showConversationsSidebar) && (
          <div className="hidden lg:block">
            <ConversationsSidebar
              conversations={conversations}
              currentConversationId={currentConversationId}
              onSelectConversation={switchToConversation}
              onNewConversation={startNewConversation}
              onDeleteConversation={deleteConversation}
              onRenameConversation={renameConversation}
              onClearAll={clearAllConversations}
            />
          </div>
        )}

        {/* Main Content */}
        <main className="flex-1 flex flex-col items-center justify-center overflow-hidden relative pt-20">
          <SpotlightEffect />
          <PageWrapper>
            <div className="container flex flex-col items-center justify-center px-4 py-8 text-center z-10 max-w-6xl">
              {/* Hero Section - Hide when actively chatting */}
              {!hasActiveConversation && (
                <>
                  <div className="space-y-4 mb-12">
                    <GradientHeadline />
                    <Subheadline />
                  </div>
                </>
              )}

              {/* Main Chat Interface */}
              <ChatInterface onConversationStart={handleConversationStart} />

              {/* Email Signup Section - Only show when no active conversation */}
              {!hasActiveConversation && <ComingSoonSection />}

              {/* Features Preview - Only show when no active conversation */}
              {!hasActiveConversation && <FeaturesPreview onGetStarted={handleGetStarted} />}
            </div>
          </PageWrapper>
        </main>
      </div>
      {/* Footer - Only show when no active conversation */}
      {!hasActiveConversation && <Footer />}
    </>
  )
}
