"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"

interface EmojiReactionsProps {
  message: string
}

const emojiMap: Record<string, string[]> = {
  // Shakespeare plays
  romeo: ["🌹", "💕", "🌙"],
  juliet: ["🌹", "💕", "⭐"],
  hamlet: ["💀", "👑", "⚔️"],
  macbeth: ["👑", "🗡️", "🩸"],
  othello: ["💔", "😡", "🎭"],
  lear: ["👑", "⚡", "😢"],

  // Theater terms
  stage: ["🎭", "🎪", "✨"],
  performance: ["🎭", "👏", "🌟"],
  rehearse: ["🎭", "📝", "💪"],
  scene: ["🎬", "🎭", "✨"],
  character: ["🎭", "🎪", "🌟"],
  monologue: ["🎤", "🎭", "💬"],
  dialogue: ["💬", "🎭", "🗣️"],

  // Emotions
  love: ["💕", "❤️", "💖"],
  death: ["💀", "⚰️", "🖤"],
  anger: ["😡", "🔥", "💢"],
  joy: ["😊", "🌟", "✨"],
  sadness: ["😢", "💧", "💔"],
}

export default function EmojiReactions({ message }: EmojiReactionsProps) {
  const [emojis, setEmojis] = useState<Array<{ id: string; emoji: string; x: number; y: number }>>([])

  useEffect(() => {
    const lowerMessage = message.toLowerCase()
    const triggeredEmojis: string[] = []

    // Check for keywords in the message
    Object.entries(emojiMap).forEach(([keyword, emojiList]) => {
      if (lowerMessage.includes(keyword)) {
        triggeredEmojis.push(...emojiList)
      }
    })

    // Remove duplicates and limit to 3 emojis
    const uniqueEmojis = [...new Set(triggeredEmojis)].slice(0, 3)

    if (uniqueEmojis.length > 0) {
      const newEmojis = uniqueEmojis.map((emoji, index) => ({
        id: `${Date.now()}-${index}`,
        emoji,
        x: Math.random() * 100,
        y: Math.random() * 50,
      }))

      setEmojis(newEmojis)

      // Clear emojis after animation
      setTimeout(() => {
        setEmojis([])
      }, 3000)
    }
  }, [message])

  return (
    <div className="relative">
      <AnimatePresence>
        {emojis.map((emojiObj) => (
          <motion.div
            key={emojiObj.id}
            initial={{ opacity: 0, scale: 0, x: emojiObj.x, y: emojiObj.y }}
            animate={{
              opacity: 1,
              scale: [0, 1.2, 1],
              y: emojiObj.y - 30,
              rotate: [0, 10, -10, 0],
            }}
            exit={{ opacity: 0, scale: 0, y: emojiObj.y - 60 }}
            transition={{
              duration: 2.5,
              ease: "easeOut",
              scale: { times: [0, 0.3, 1], duration: 0.5 },
            }}
            className="absolute text-2xl pointer-events-none z-10"
            style={{ left: `${emojiObj.x}%`, top: `${emojiObj.y}%` }}
          >
            {emojiObj.emoji}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  )
}
