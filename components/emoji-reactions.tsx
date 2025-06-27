"use client"

import { useEffect, useState } from "react"

interface EmojiReactionsProps {
  trigger: boolean
  messageContent: string
}

export function EmojiReactions({ trigger, messageContent }: EmojiReactionsProps) {
  const [currentEmoji, setCurrentEmoji] = useState<string>("")
  const [showEmoji, setShowEmoji] = useState(false)

  const getContextualEmoji = (message: string): string => {
    if (!message || typeof message !== "string") return "🎭"

    const lowerMessage = message.toLowerCase()

    // Shakespeare plays
    if (lowerMessage.includes("hamlet")) return "💀"
    if (lowerMessage.includes("romeo") || lowerMessage.includes("juliet")) return "💕"
    if (lowerMessage.includes("macbeth")) return "⚔️"
    if (lowerMessage.includes("othello")) return "🗡️"
    if (lowerMessage.includes("king lear")) return "👑"

    // Modern plays
    if (lowerMessage.includes("streetcar")) return "🚋"
    if (lowerMessage.includes("death of a salesman")) return "💼"
    if (lowerMessage.includes("glass menagerie")) return "🦄"

    // Emotions and actions
    if (lowerMessage.includes("angry") || lowerMessage.includes("rage")) return "😡"
    if (lowerMessage.includes("sad") || lowerMessage.includes("cry")) return "😢"
    if (lowerMessage.includes("happy") || lowerMessage.includes("joy")) return "😊"
    if (lowerMessage.includes("love") || lowerMessage.includes("romance")) return "❤️"

    // Theater terms
    if (lowerMessage.includes("monologue") || lowerMessage.includes("soliloquy")) return "🎤"
    if (lowerMessage.includes("scene") || lowerMessage.includes("act")) return "🎬"
    if (lowerMessage.includes("rehearse") || lowerMessage.includes("practice")) return "🎯"

    // Default theater emoji
    return "🎭"
  }

  useEffect(() => {
    if (trigger && messageContent) {
      const emoji = getContextualEmoji(messageContent)
      setCurrentEmoji(emoji)
      setShowEmoji(true)

      const timer = setTimeout(() => {
        setShowEmoji(false)
      }, 2000)

      return () => clearTimeout(timer)
    }
  }, [trigger, messageContent])

  if (!showEmoji) return null

  return (
    <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 pointer-events-none">
      <div
        className="text-4xl transition-all duration-500 ease-out"
        style={{
          opacity: showEmoji ? 1 : 0,
          transform: showEmoji ? "scale(1)" : "scale(0.5)",
        }}
      >
        {currentEmoji}
      </div>
    </div>
  )
}
