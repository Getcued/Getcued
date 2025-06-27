"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"

interface EmojiReactionsProps {
  message: string
}

export default function EmojiReactions({ message }: EmojiReactionsProps) {
  const [emojis, setEmojis] = useState<string[]>([])

  const emojiMap: Record<string, string[]> = {
    // Shakespeare plays
    romeo: ["💕", "🌹", "🌙"],
    juliet: ["💕", "🌹", "⭐"],
    hamlet: ["💀", "👑", "⚔️"],
    macbeth: ["👑", "🗡️", "🌙"],
    othello: ["💔", "🎭", "⚔️"],
    "king lear": ["👑", "⚡", "💔"],

    // Theater terms
    rehearse: ["🎭", "🎪", "✨"],
    scene: ["🎬", "🎭", "🌟"],
    character: ["🎭", "🎪", "🎨"],
    monologue: ["🎤", "🎭", "💫"],
    soliloquy: ["💭", "🎭", "🌟"],
    stage: ["🎭", "🎪", "✨"],
    performance: ["🎭", "👏", "🌟"],
    acting: ["🎭", "🎪", "✨"],

    // Emotions
    love: ["💕", "❤️", "💖"],
    death: ["💀", "🖤", "⚰️"],
    anger: ["😡", "🔥", "⚡"],
    sadness: ["😢", "💔", "🌧️"],
    joy: ["😊", "🌟", "✨"],
    fear: ["😨", "👻", "🌙"],

    // General theater
    practice: ["💪", "🎯", "⭐"],
    feedback: ["💡", "📝", "👍"],
    improve: ["📈", "⭐", "💪"],
    lines: ["📝", "🎭", "💭"],
  }

  useEffect(() => {
    const messageWords = message.toLowerCase().split(/\s+/)
    const triggeredEmojis: string[] = []

    // Check for emoji triggers
    Object.entries(emojiMap).forEach(([trigger, emojiList]) => {
      if (messageWords.some((word) => word.includes(trigger))) {
        triggeredEmojis.push(...emojiList)
      }
    })

    // Remove duplicates and limit to 3 emojis
    const uniqueEmojis = [...new Set(triggeredEmojis)].slice(0, 3)

    if (uniqueEmojis.length > 0) {
      setEmojis(uniqueEmojis)

      // Clear emojis after animation
      setTimeout(() => {
        setEmojis([])
      }, 3000)
    }
  }, [message])

  return (
    <div className="relative h-8">
      <AnimatePresence>
        {emojis.map((emoji, index) => (
          <motion.div
            key={`${emoji}-${index}`}
            initial={{
              opacity: 0,
              scale: 0,
              x: Math.random() * 100 - 50,
              y: 0,
            }}
            animate={{
              opacity: 1,
              scale: 1.2,
              y: -30,
              x: Math.random() * 60 - 30,
            }}
            exit={{
              opacity: 0,
              scale: 0,
              y: -60,
            }}
            transition={{
              duration: 0.8,
              delay: index * 0.2,
              ease: "easeOut",
            }}
            className="absolute text-2xl pointer-events-none"
            style={{
              left: `${20 + index * 30}%`,
              zIndex: 10,
            }}
          >
            {emoji}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  )
}
