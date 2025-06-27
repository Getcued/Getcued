"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"

interface EmojiReactionsProps {
  trigger: boolean
  messageContent: string
}

// Emoji mappings based on content analysis
const getContextualEmojis = (content: string): string[] => {
  const lowerContent = content.toLowerCase()

  // Shakespeare-specific emojis
  if (lowerContent.includes("romeo") || lowerContent.includes("juliet")) {
    return ["💕", "🌹", "✨", "🎭", "💫"]
  }

  if (lowerContent.includes("hamlet")) {
    return ["💀", "👑", "⚔️", "🎭", "🌙"]
  }

  if (lowerContent.includes("macbeth")) {
    return ["👑", "⚔️", "🩸", "🌙", "👻"]
  }

  if (lowerContent.includes("othello")) {
    return ["💔", "🗡️", "😡", "🎭", "⚡"]
  }

  // Modern drama emojis
  if (lowerContent.includes("streetcar") || lowerContent.includes("blanche")) {
    return ["🌺", "💔", "🥀", "🎭", "✨"]
  }

  if (lowerContent.includes("death of a salesman") || lowerContent.includes("willy")) {
    return ["💼", "💔", "🏠", "😔", "⭐"]
  }

  if (lowerContent.includes("glass menagerie")) {
    return ["🦄", "💙", "🌸", "✨", "🎭"]
  }

  // Emotion-based emojis
  if (lowerContent.includes("love") || lowerContent.includes("romance")) {
    return ["💕", "💖", "🌹", "✨", "💫"]
  }

  if (lowerContent.includes("anger") || lowerContent.includes("rage")) {
    return ["🔥", "⚡", "💥", "😤", "🌪️"]
  }

  if (lowerContent.includes("sad") || lowerContent.includes("cry")) {
    return ["💧", "💔", "🌧️", "😢", "🥀"]
  }

  if (lowerContent.includes("happy") || lowerContent.includes("joy")) {
    return ["✨", "🌟", "😊", "🎉", "🌈"]
  }

  if (lowerContent.includes("fear") || lowerContent.includes("scared")) {
    return ["👻", "⚡", "🌙", "😰", "💀"]
  }

  // Acting/theater general emojis
  if (lowerContent.includes("rehearse") || lowerContent.includes("practice")) {
    return ["🎭", "✨", "🎪", "🌟", "🎨"]
  }

  if (lowerContent.includes("monologue") || lowerContent.includes("soliloquy")) {
    return ["🎤", "🎭", "✨", "🌟", "💫"]
  }

  if (lowerContent.includes("scene") || lowerContent.includes("dialogue")) {
    return ["🎬", "🎭", "✨", "🎪", "🌟"]
  }

  // Default theatrical emojis
  return ["🎭", "✨", "🎪", "🌟", "🎨"]
}

export function EmojiReactions({ trigger, messageContent }: EmojiReactionsProps) {
  const [emojis, setEmojis] = useState<Array<{ id: number; emoji: string; x: number; y: number }>>([])

  useEffect(() => {
    if (trigger && messageContent) {
      const contextualEmojis = getContextualEmojis(messageContent)
      const newEmojis = Array.from({ length: 5 }, (_, i) => ({
        id: Date.now() + i,
        emoji: contextualEmojis[Math.floor(Math.random() * contextualEmojis.length)],
        x: Math.random() * 100,
        y: Math.random() * 100,
      }))

      setEmojis(newEmojis)

      // Clear emojis after animation
      setTimeout(() => setEmojis([]), 3000)
    }
  }, [trigger, messageContent])

  return (
    <div className="fixed inset-0 pointer-events-none z-50">
      <AnimatePresence>
        {emojis.map((emoji) => (
          <motion.div
            key={emoji.id}
            className="absolute text-2xl"
            style={{
              left: `${emoji.x}%`,
              top: `${emoji.y}%`,
            }}
            initial={{
              opacity: 0,
              scale: 0,
              y: 0,
            }}
            animate={{
              opacity: [0, 1, 1, 0],
              scale: [0, 1.2, 1, 0.8],
              y: -100,
              rotate: [0, 10, -10, 0],
            }}
            exit={{
              opacity: 0,
              scale: 0,
            }}
            transition={{
              duration: 2.5,
              ease: "easeOut",
              times: [0, 0.2, 0.8, 1],
            }}
          >
            {emoji.emoji}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  )
}
