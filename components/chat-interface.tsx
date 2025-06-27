"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Send, Mic, Upload, Bot, User } from "lucide-react"
import { EmojiReactions } from "./emoji-reactions"

interface Message {
  id: string
  content: string
  role: "user" | "assistant"
  timestamp: Date
}

const scriptSuggestions = [
  "Help me with Hamlet's 'To be or not to be' soliloquy",
  "Practice Romeo and Juliet balcony scene",
  "Work on Lady Macbeth's sleepwalking scene",
  "Rehearse a modern monologue",
  "Character development exercises",
  "Voice and diction practice",
]

export function ChatInterface() {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [emojiTrigger, setEmojiTrigger] = useState(false)
  const [lastMessageContent, setLastMessageContent] = useState("")
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  // Welcome message
  useEffect(() => {
    if (messages.length === 0) {
      const welcomeMessage: Message = {
        id: "welcome",
        content:
          "Welcome to your personal rehearsal studio! I'm here to help you practice scenes, develop characters, and improve your acting technique. What would you like to work on today?",
        role: "assistant",
        timestamp: new Date(),
      }
      setMessages([welcomeMessage])
    }
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || isLoading) return

    const userMessage: Message = {
      id: Date.now().toString(),
      content: input.trim(),
      role: "user",
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setIsLoading(true)

    // Trigger emoji reaction
    setLastMessageContent(userMessage.content)
    setEmojiTrigger((prev) => !prev)

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: userMessage.content,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to get response")
      }

      const data = await response.json()

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: data.content || data.response || "I'm here to help with your rehearsal!",
        role: "assistant",
        timestamp: new Date(),
      }

      setMessages((prev) => [...prev, assistantMessage])

      // Trigger emoji reaction for assistant message
      setTimeout(() => {
        setLastMessageContent(assistantMessage.content)
        setEmojiTrigger((prev) => !prev)
      }, 500)
    } catch (error) {
      console.error("Error:", error)
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: "I'm having trouble connecting right now. Please try again in a moment.",
        role: "assistant",
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  const handleSuggestionClick = (suggestion: string) => {
    setInput(suggestion)
  }

  const handleFileUpload = () => {
    fileInputRef.current?.click()
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      console.log("File selected:", file.name)
      // File processing would go here
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-black p-4" data-chat-interface>
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Script Rehearsal Studio</h1>
          <p className="text-gray-300">Your AI scene partner for character development and practice</p>
        </div>

        {/* Chat Container */}
        <div className="bg-black/40 backdrop-blur-sm rounded-2xl shadow-2xl border border-gray-700/50 overflow-hidden">
          {/* Messages Area */}
          <div className="h-96 overflow-y-auto p-6 space-y-4">
            {messages.map((message) => (
              <div key={message.id} className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}>
                <div
                  className={`flex items-start space-x-3 max-w-[80%] ${
                    message.role === "user" ? "flex-row-reverse space-x-reverse" : ""
                  }`}
                >
                  {/* Avatar */}
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                      message.role === "user" ? "bg-purple-600" : "bg-gray-700"
                    }`}
                  >
                    {message.role === "user" ? (
                      <User className="w-4 h-4 text-white" />
                    ) : (
                      <Bot className="w-4 h-4 text-purple-300" />
                    )}
                  </div>

                  {/* Message Bubble */}
                  <div
                    className={`rounded-2xl px-4 py-3 ${
                      message.role === "user"
                        ? "bg-purple-600 text-white"
                        : "bg-gray-800 text-gray-100 border border-gray-600"
                    }`}
                  >
                    <p className="text-sm leading-relaxed font-normal">{message.content}</p>
                    <p className={`text-xs mt-2 ${message.role === "user" ? "text-purple-200" : "text-gray-400"}`}>
                      {message.timestamp.toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
                </div>
              </div>
            ))}

            {/* Loading indicator */}
            {isLoading && (
              <div className="flex justify-start">
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center">
                    <Bot className="w-4 h-4 text-purple-300" />
                  </div>
                  <div className="bg-gray-800 border border-gray-600 rounded-2xl px-4 py-3">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce"></div>
                      <div
                        className="w-2 h-2 bg-purple-400 rounded-full animate-bounce"
                        style={{ animationDelay: "0.1s" }}
                      ></div>
                      <div
                        className="w-2 h-2 bg-purple-400 rounded-full animate-bounce"
                        style={{ animationDelay: "0.2s" }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Suggestions */}
          {messages.length <= 1 && (
            <div className="px-6 py-4 border-t border-gray-700/50">
              <p className="text-gray-400 text-sm mb-3">Try these suggestions:</p>
              <div className="flex flex-wrap gap-2">
                {scriptSuggestions.map((suggestion, index) => (
                  <button
                    key={index}
                    onClick={() => handleSuggestionClick(suggestion)}
                    className="px-3 py-2 bg-gray-800 hover:bg-gray-700 text-gray-200 text-xs rounded-full border border-gray-600 transition-colors duration-200 hover:border-purple-500"
                    disabled={isLoading}
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Input Area */}
          <div className="p-6 border-t border-gray-700/50">
            <form onSubmit={handleSubmit} className="flex items-center space-x-3">
              <div className="flex-1 relative">
                <Input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask about a scene, character, or start rehearsing..."
                  className="bg-gray-800 border-gray-600 text-white placeholder-gray-400 rounded-xl pr-20 focus:border-purple-500 focus:ring-purple-500/20"
                  disabled={isLoading}
                />
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex space-x-1">
                  <Button
                    type="button"
                    size="sm"
                    variant="ghost"
                    onClick={handleFileUpload}
                    className="p-1 h-6 w-6 text-gray-400 hover:text-white"
                  >
                    <Upload className="h-3 w-3" />
                  </Button>
                  <Button
                    type="button"
                    size="sm"
                    variant="ghost"
                    className="p-1 h-6 w-6 text-gray-400 hover:text-white"
                  >
                    <Mic className="h-3 w-3" />
                  </Button>
                </div>
              </div>
              <Button
                type="submit"
                disabled={!input.trim() || isLoading}
                className="bg-purple-600 hover:bg-purple-700 text-white rounded-xl px-6"
              >
                <Send className="h-4 w-4" />
              </Button>
            </form>

            <input
              ref={fileInputRef}
              type="file"
              accept=".txt,.pdf,.doc,.docx"
              onChange={handleFileChange}
              className="hidden"
            />
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-6">
          <p className="text-gray-400 text-sm">Press Enter to send • Upload scripts • Practice with AI coaching</p>
        </div>
      </div>

      <EmojiReactions trigger={emojiTrigger} messageContent={lastMessageContent} />
    </div>
  )
}
