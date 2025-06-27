"use client"

import { useState, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Send, Mic, Theater, Users, BookOpen, Sparkles, Bot } from "lucide-react"
import EmojiReactions from "./emoji-reactions"

interface Message {
  id: string
  content: string
  sender: "user" | "ai"
  timestamp: Date
}

const scriptSuggestions = [
  {
    icon: Theater,
    title: "Romeo & Juliet - Balcony Scene",
    prompt: "Let's rehearse the balcony scene from Romeo and Juliet, Act 2 Scene 2. You be Romeo, I'll be Juliet.",
  },
  {
    icon: Users,
    title: "Hamlet - To Be or Not To Be",
    prompt: "Help me work on Hamlet's famous soliloquy 'To be or not to be' from Act 3, Scene 1.",
  },
  {
    icon: BookOpen,
    title: "Macbeth - Lady Macbeth Sleepwalking",
    prompt:
      "Let's practice Lady Macbeth's sleepwalking scene from Act 5, Scene 1. I need help with her guilt and madness.",
  },
  {
    icon: Sparkles,
    title: "A Streetcar Named Desire - Blanche",
    prompt:
      "I want to work on Blanche DuBois from A Streetcar Named Desire. Help me understand her vulnerability and delusion.",
  },
]

export default function ChatInterface() {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [showEmojiReaction, setShowEmojiReaction] = useState(false)
  const [lastMessageContent, setLastMessageContent] = useState("")

  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const handleSend = async () => {
    if (!input.trim() || isLoading) return

    const userMessage: Message = {
      id: Date.now().toString(),
      content: input.trim(),
      sender: "user",
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setLastMessageContent(input.trim())
    setShowEmojiReaction(true)
    setTimeout(() => setShowEmojiReaction(false), 100)

    setInput("")
    setIsLoading(true)

    try {
      // Simulate AI response
      await new Promise((resolve) => setTimeout(resolve, 1500))

      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        content:
          "Great choice! Let's dive into that scene. I'll help you explore the character's motivations and emotions. What specific aspect would you like to work on first?",
        sender: "ai",
        timestamp: new Date(),
      }

      setMessages((prev) => [...prev, aiMessage])
      setLastMessageContent(aiMessage.content)
      setShowEmojiReaction(true)
      setTimeout(() => setShowEmojiReaction(false), 100)
    } catch (error) {
      console.error("Chat error:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleExampleClick = (prompt: string) => {
    setInput(prompt)
    setTimeout(() => {
      textareaRef.current?.focus()
    }, 100)
  }

  const hasStartedChatting = messages.length > 0 || isLoading

  return (
    <motion.div
      className="w-full mx-auto px-4 max-w-4xl"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 1 }}
      data-chat-interface
    >
      <EmojiReactions trigger={showEmojiReaction} messageContent={lastMessageContent} />

      {/* Chat Messages */}
      <AnimatePresence>
        {hasStartedChatting && (
          <motion.div
            className="mb-6 space-y-6 max-h-[500px] overflow-y-auto"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
          >
            {messages.map((msg, index) => (
              <motion.div
                key={msg.id}
                className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <div
                  className={`flex items-start space-x-3 max-w-[80%] ${msg.sender === "user" ? "flex-row-reverse space-x-reverse" : ""}`}
                >
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      msg.sender === "user" ? "bg-gradient-to-r from-pink-500 to-purple-600" : "bg-gray-700"
                    }`}
                  >
                    {msg.sender === "user" ? (
                      <span className="text-white text-sm font-medium">U</span>
                    ) : (
                      <Bot className="w-4 h-4 text-pink-400" />
                    )}
                  </div>
                  <div
                    className={`rounded-2xl px-5 py-4 ${
                      msg.sender === "user"
                        ? "bg-gradient-to-r from-pink-500 to-purple-600 text-white"
                        : "bg-gray-800/60 backdrop-blur-sm text-gray-100 border border-gray-700/50"
                    }`}
                  >
                    {msg.sender === "ai" && <div className="text-xs text-pink-400 font-medium mb-2">Cued AI</div>}
                    <div className="whitespace-pre-wrap">{msg.content}</div>
                  </div>
                </div>
              </motion.div>
            ))}

            {isLoading && (
              <motion.div className="flex justify-start" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                <div className="flex items-start space-x-3 max-w-[80%]">
                  <div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center">
                    <Bot className="w-4 h-4 text-pink-400" />
                  </div>
                  <div className="bg-gray-800/60 backdrop-blur-sm border border-gray-700/50 rounded-2xl px-5 py-4">
                    <div className="text-xs text-pink-400 font-medium mb-2">Cued AI</div>
                    <div className="flex items-center space-x-2">
                      <div className="flex space-x-1">
                        <motion.div
                          className="w-2 h-2 bg-pink-400 rounded-full"
                          animate={{ scale: [1, 1.2, 1] }}
                          transition={{ duration: 0.6, repeat: Number.POSITIVE_INFINITY, delay: 0 }}
                        />
                        <motion.div
                          className="w-2 h-2 bg-pink-400 rounded-full"
                          animate={{ scale: [1, 1.2, 1] }}
                          transition={{ duration: 0.6, repeat: Number.POSITIVE_INFINITY, delay: 0.2 }}
                        />
                        <motion.div
                          className="w-2 h-2 bg-pink-400 rounded-full"
                          animate={{ scale: [1, 1.2, 1] }}
                          transition={{ duration: 0.6, repeat: Number.POSITIVE_INFINITY, delay: 0.4 }}
                        />
                      </div>
                      <span className="text-gray-400 text-sm">Thinking...</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
            <div ref={messagesEndRef} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Welcome Message */}
      {!hasStartedChatting && (
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ delay: 1.2 }}
        >
          <h2 className="text-2xl md:text-3xl font-semibold text-white mb-4">Ready to rehearse?</h2>
          <p className="text-gray-300 text-lg">Choose a scene below or describe what you'd like to work on.</p>
        </motion.div>
      )}

      {/* Script Suggestions */}
      {!hasStartedChatting && (
        <motion.div
          className="mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ delay: 1.4 }}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {scriptSuggestions.map((example, index) => (
              <motion.button
                key={example.title}
                onClick={() => handleExampleClick(example.prompt)}
                className="p-4 bg-gray-900/50 backdrop-blur-sm border border-gray-700/50 rounded-lg text-left hover:border-pink-500/50 hover:bg-gray-800/50 transition-all duration-200 group"
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.6 + index * 0.1 }}
              >
                <div className="flex items-start space-x-3">
                  <div className="p-2 bg-gradient-to-br from-pink-500/20 to-purple-600/20 rounded-lg group-hover:from-pink-500/30 group-hover:to-purple-600/30 transition-colors">
                    <example.icon className="w-5 h-5 text-pink-400" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-white font-medium mb-1">{example.title}</h3>
                    <p className="text-gray-400 text-sm leading-relaxed">{example.prompt}</p>
                  </div>
                </div>
              </motion.button>
            ))}
          </div>
        </motion.div>
      )}

      {/* Chat Input */}
      <motion.div
        className="relative"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 1.8 }}
      >
        <div className="relative bg-gray-900/50 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-4 focus-within:border-pink-500/50 transition-colors">
          <Textarea
            ref={textareaRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Start your scene... 'Let's rehearse the balcony scene from Romeo and Juliet'"
            className="w-full bg-transparent border-none resize-none text-white placeholder-gray-400 focus:ring-0 focus:outline-none min-h-[60px] max-h-[200px]"
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault()
                handleSend()
              }
            }}
          />

          <div className="flex items-center justify-between mt-3">
            <div className="flex items-center space-x-2">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-gray-800/50 transition-colors"
              >
                <Mic className="w-4 h-4" />
              </Button>
              <span className="text-xs text-gray-500">Press to speak</span>
            </div>

            <Button
              onClick={handleSend}
              disabled={!input.trim() || isLoading}
              className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white font-medium px-6 py-2 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 group"
            >
              <Send className="w-4 h-4 mr-2 group-hover:translate-x-0.5 transition-transform" />
              {isLoading ? "Thinking..." : "Start Scene"}
            </Button>
          </div>
        </div>

        <p className="text-xs text-gray-500 text-center mt-3">
          Press Enter to send, Shift + Enter for new line • 🎤 Click mic to speak
        </p>
      </motion.div>
    </motion.div>
  )
}
