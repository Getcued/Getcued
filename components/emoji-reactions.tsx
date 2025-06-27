"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"

interface EmojiReactionsProps {
  message: string
}

const getContextualEmojis = (message: string): string[] => {
  const text = message.toLowerCase()

  // Shakespeare plays
  if (text.includes("romeo") || text.includes("juliet")) return ["🌹", "💕", "🌙"]
  if (text.includes("hamlet")) return ["💀", "👑", "⚔️"]
  if (text.includes("macbeth")) return ["🗡️", "👑", "🩸"]
  if (text.includes("othello")) return ["💔", "🎭", "⚔️"]

  // Theater terms
  if (text.includes("stage") || text.includes("perform")) return ["🎭", "🎪", "✨"]
  if (text.includes("rehearse") || text.includes("practice")) return ["🎯", "💪", "🎭"]
  if (text.includes("scene") || text.includes("act")) return ["🎬", "🎭", "📜"]
  if (text.includes("character")) return ["🎭", "🎪", "👤"]

  // Emotions
  if (text.includes("love") || text.includes("heart")) return ["❤️", "💕", "💖"]
  if (text.includes("death") || text.includes("die")) return ["💀", "⚰️", "🖤"]
  if (text.includes("anger") || text.includes("rage")) return ["😡", "🔥", "⚡"]
  if (text.includes("joy") || text.includes("happy")) return ["😊", "🌟", "✨"]

  // Default theater emojis
  return ["🎭", "✨", "🎪"]
}

export default function EmojiReactions({ message }: EmojiReactionsProps) {
  const [showEmojis, setShowEmojis] = useState(false)
  const [emojis, setEmojis] = useState<string[]>([])

  useEffect(() => {
    const contextEmojis = getContextualEmojis(message)
    setEmojis(contextEmojis)

    const timer = setTimeout(() => {
      setShowEmojis(true)
    }, 500)

    const hideTimer = setTimeout(() => {
      setShowEmojis(false)
    }, 3000)

    return () => {
      clearTimeout(timer)
      clearTimeout(hideTimer)
    }
  }, [message])

  return (
    <AnimatePresence>
      {showEmojis && (
        <motion.div
          className="flex space-x-1 mt-2"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          transition={{ duration: 0.3 }}
        >
          {emojis.map((emoji, index) => (
            <motion.span
              key={index}
              className="text-lg"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              {emoji}
            </motion.span>
          ))}
        </motion.div>
      )}
    </AnimatePresence>
  )
}
