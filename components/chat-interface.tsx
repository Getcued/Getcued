"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent } from "@/components/ui/card"
import { Send, Mic, Upload, User, Bot } from "lucide-react"
import EmojiReactions from "@/components/emoji-reactions"

interface Message {
  id: string
  content: string
  sender: "user" | "ai"
  timestamp: Date
}

const scriptSuggestions = [
  "Let's rehearse the balcony scene from Romeo and Juliet",
  "I want to practice Hamlet's 'To be or not to be' soliloquy",
  "Can we work on Lady Macbeth's sleepwalking scene?",
  "Help me with Blanche's monologue from A Streetcar Named Desire",
]

export default function ChatInterface() {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSend = async () => {
    if (!input.trim()) return

    const userMessage: Message = {
      id: Date.now().toString(),
      content: input,
      sender: "user",
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setIsLoading(true)

    // Simulate AI response
    setTimeout(() => {
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: getAIResponse(input),
        sender: "ai",
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, aiMessage])
      setIsLoading(false)
    }, 1000)
  }

  const getAIResponse = (userInput: string): string => {
    const lowerInput = userInput.toLowerCase()

    if (lowerInput.includes("romeo") || lowerInput.includes("juliet")) {
      return "Perfect choice! The balcony scene is one of Shakespeare's most beautiful. I'll play Romeo to your Juliet, or vice versa. Which character would you like to embody? Let's start with 'But soft, what light through yonder window breaks?'"
    }

    if (lowerInput.includes("hamlet")) {
      return "Ah, Hamlet's famous soliloquy! This is a deeply philosophical moment where Hamlet contemplates existence. Let's work on the rhythm and emotional journey. Begin when you're ready: 'To be or not to be, that is the question...'"
    }

    if (lowerInput.includes("macbeth") || lowerInput.includes("lady macbeth")) {
      return "Lady Macbeth's sleepwalking scene is incredibly powerful - showing her guilt and psychological breakdown. Focus on the fragmented speech and haunted movements. Shall we begin with 'Out, damned spot! Out, I say!'?"
    }

    if (lowerInput.includes("streetcar") || lowerInput.includes("blanche")) {
      return "Blanche DuBois is such a complex character! Her monologues reveal her vulnerability beneath the facade. Which specific moment would you like to explore? The paper lantern scene? Her final breakdown? Let me know and we'll dive deep into her emotional truth."
    }

    return "I'm excited to be your scene partner! Whether you want to work on classical Shakespeare, contemporary drama, or anything in between, I'm here to help. What script or scene would you like to rehearse today?"
  }

  const handleSuggestionClick = (suggestion: string) => {
    setInput(suggestion)
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <div className="w-full max-w-4xl mx-auto" data-chat-interface>
      <Card className="bg-gray-900 border-gray-700">
        <CardContent className="p-6">
          {/* Messages */}
          <div className="h-96 overflow-y-auto mb-6 space-y-4">
            {messages.length === 0 && (
              <div className="text-center text-gray-400 py-8">
                <Bot className="w-12 h-12 mx-auto mb-4 text-purple-400" />
                <p className="text-lg mb-2">Ready to rehearse?</p>
                <p className="text-sm">Choose a suggestion below or tell me what you'd like to practice!</p>
              </div>
            )}

            {messages.map((message) => (
              <div key={message.id} className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}>
                <div
                  className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                    message.sender === "user" ? "bg-purple-600 text-white" : "bg-gray-800 text-gray-100"
                  }`}
                >
                  <div className="flex items-start gap-2">
                    {message.sender === "ai" && <Bot className="w-5 h-5 mt-0.5 text-purple-400" />}
                    {message.sender === "user" && <User className="w-5 h-5 mt-0.5" />}
                    <div className="flex-1">
                      <p className="text-sm leading-relaxed">{message.content}</p>
                      <EmojiReactions message={message.content} />
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-gray-800 rounded-2xl px-4 py-3">
                  <div className="flex items-center gap-2">
                    <Bot className="w-5 h-5 text-purple-400" />
                    <div className="flex gap-1">
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
          {messages.length === 0 && (
            <div className="mb-6">
              <p className="text-sm text-gray-400 mb-3">Popular scenes to get started:</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {scriptSuggestions.map((suggestion, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    size="sm"
                    onClick={() => handleSuggestionClick(suggestion)}
                    className="text-left justify-start h-auto py-3 px-4 bg-gray-800 border-gray-600 hover:bg-gray-700 text-gray-300 hover:text-white"
                  >
                    {suggestion}
                  </Button>
                ))}
              </div>
            </div>
          )}

          {/* Input */}
          <div className="flex gap-3">
            <div className="flex-1">
              <Textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="What scene would you like to rehearse today?"
                className="min-h-[60px] bg-gray-800 border-gray-600 text-white placeholder-gray-400 resize-none"
              />
            </div>
            <div className="flex flex-col gap-2">
              <Button
                onClick={handleSend}
                disabled={!input.trim() || isLoading}
                size="icon"
                className="bg-purple-600 hover:bg-purple-700"
              >
                <Send className="w-4 h-4" />
              </Button>
              <Button variant="outline" size="icon" className="border-gray-600 hover:bg-gray-800 bg-transparent">
                <Mic className="w-4 h-4" />
              </Button>
              <Button variant="outline" size="icon" className="border-gray-600 hover:bg-gray-800 bg-transparent">
                <Upload className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
