"use client"

import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"

interface EmojiReactionsProps {
  trigger: boolean
  messageContent: string
}

const getContextualEmoji = (message: string): string => {
  if (!message || typeof message !== "string") return "🎭"

  const lowerMessage = message.toLowerCase()

  // Shakespeare plays
  if (lowerMessage.includes("hamlet")) return "💀"
  if (lowerMessage.includes("romeo") || lowerMessage.includes("juliet")) return "💕"
  if (lowerMessage.includes("macbeth")) return "⚔️"
  if (lowerMessage.includes("othello")) return "🗡️"
  if (lowerMessage.includes("king lear")) return "👑"
  if (lowerMessage.includes("midsummer")) return "🧚"

  // Other classic plays
  if (lowerMessage.includes("streetcar")) return "🚋"
  if (lowerMessage.includes("death of a salesman")) return "💼"
  if (lowerMessage.includes("glass menagerie")) return "🦄"
  if (lowerMessage.includes("cherry orchard")) return "🍒"
  if (lowerMessage.includes("waiting for godot")) return "⏰"

  // Emotions and themes
  if (lowerMessage.includes("love") || lowerMessage.includes("romance")) return "💖"
  if (lowerMessage.includes("death") || lowerMessage.includes("tragedy")) return "⚰️"
  if (lowerMessage.includes("comedy") || lowerMessage.includes("funny")) return "😂"
  if (lowerMessage.includes("anger") || lowerMessage.includes("rage")) return "🔥"
  if (lowerMessage.includes("fear") || lowerMessage.includes("scared")) return "😰"
  if (lowerMessage.includes("joy") || lowerMessage.includes("happy")) return "✨"
  if (lowerMessage.includes("sad") || lowerMessage.includes("sorrow")) return "😢"

  // Acting terms
  if (lowerMessage.includes("monologue")) return "🎤"
  if (lowerMessage.includes("scene")) return "🎬"
  if (lowerMessage.includes("character")) return "🎭"
  if (lowerMessage.includes("rehearse") || lowerMessage.includes("practice")) return "🎯"
  if (lowerMessage.includes("audition")) return "🎪"
  if (lowerMessage.includes("stage")) return "🎪"
  if (lowerMessage.includes("performance")) return "⭐"

  return "🎭"
}

export default function EmojiReactions({ trigger, messageContent }: EmojiReactionsProps) {
  const [showEmoji, setShowEmoji] = useState(false)
  const [currentEmoji, setCurrentEmoji] = useState("🎭")

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

  return (
    <AnimatePresence>
      {showEmoji && (
        <motion.div
          initial={{ scale: 0, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0, opacity: 0, y: -20 }}
          transition={{
            type: "spring",
            stiffness: 500,
            damping: 25,
            duration: 0.3,
          }}
          className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 pointer-events-none"
        >
          <div className="text-6xl filter drop-shadow-lg">{currentEmoji}</div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
