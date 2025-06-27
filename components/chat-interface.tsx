"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent } from "@/components/ui/card"
import { Mic, Send, Upload, Bot, User } from "lucide-react"

interface Message {
  id: string
  content: string
  sender: "user" | "ai"
  timestamp: Date
}

export default function ChatInterface() {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scriptSuggestions = [
    "Let's practice the balcony scene from Romeo and Juliet",
    "Help me work on Hamlet's 'To be or not to be' soliloquy",
    "I want to rehearse Blanche's final scene from Streetcar",
    "Can we run through Lady Macbeth's sleepwalking scene?",
  ]

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const sendMessage = async (messageContent: string) => {
    if (!messageContent.trim()) return

    const userMessage: Message = {
      id: Date.now().toString(),
      content: messageContent,
      sender: "user",
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setIsLoading(true)

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: messageContent,
          messages: [...messages, userMessage].map((msg) => ({
            role: msg.sender === "user" ? "user" : "assistant",
            content: msg.content,
          })),
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to get response")
      }

      const data = await response.json()

      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: data.message || "I'm here to help you rehearse! What scene would you like to work on?",
        sender: "ai",
        timestamp: new Date(),
      }

      setMessages((prev) => [...prev, aiMessage])
    } catch (error) {
      console.error("Error sending message:", error)
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: "I'm having trouble connecting right now. Let's try again! What scene would you like to rehearse?",
        sender: "ai",
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    sendMessage(input)
  }

  const handleSuggestionClick = (suggestion: string) => {
    setInput(suggestion)
  }

  return (
    <div className="max-w-4xl mx-auto" data-chat-interface>
      {/* Script Suggestions */}
      {messages.length === 0 && (
        <div className="mb-8">
          <h3 className="text-lg font-semibold text-white mb-4 text-center">Try these popular scenes:</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {scriptSuggestions.map((suggestion, index) => (
              <Button
                key={index}
                variant="outline"
                className="text-left h-auto p-4 bg-gray-800/50 border-gray-600 hover:bg-gray-700/50 text-white justify-start"
                onClick={() => handleSuggestionClick(suggestion)}
              >
                {suggestion}
              </Button>
            ))}
          </div>
        </div>
      )}

      {/* Messages */}
      <div className="space-y-4 mb-6 min-h-[400px] max-h-[600px] overflow-y-auto">
        {messages.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🎭</div>
            <h3 className="text-xl font-semibold text-white mb-2">Ready to rehearse?</h3>
            <p className="text-gray-400">
              Choose a scene above or start a conversation about any script you'd like to practice.
            </p>
          </div>
        ) : (
          messages.map((message) => (
            <div key={message.id} className="flex flex-col">
              <Card
                className={`max-w-[80%] ${
                  message.sender === "user"
                    ? "ml-auto bg-gradient-to-r from-pink-500 to-purple-500"
                    : "mr-auto bg-gray-800/50 border-gray-700"
                }`}
              >
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        message.sender === "user" ? "bg-white/20" : "bg-gray-700"
                      }`}
                    >
                      {message.sender === "user" ? (
                        <User className="w-4 h-4 text-white" />
                      ) : (
                        <Bot className="w-4 h-4 text-pink-400" />
                      )}
                    </div>
                    <p className={`${message.sender === "user" ? "text-white" : "text-gray-100"} flex-1`}>
                      {message.content}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          ))
        )}

        {isLoading && (
          <Card className="max-w-[80%] mr-auto bg-gray-800/50 border-gray-700">
            <CardContent className="p-4">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center">
                  <Bot className="w-4 h-4 text-pink-400" />
                </div>
                <div className="flex items-center space-x-2">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div
                      className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                      style={{ animationDelay: "0.1s" }}
                    ></div>
                    <div
                      className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                      style={{ animationDelay: "0.2s" }}
                    ></div>
                  </div>
                  <span className="text-gray-400 text-sm">Cued is thinking...</span>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex space-x-2">
          <div className="flex-1 relative">
            <Textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about a scene, request feedback, or start rehearsing..."
              className="min-h-[60px] bg-gray-800/50 border-gray-600 text-white placeholder-gray-400 resize-none pr-12"
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault()
                  handleSubmit(e)
                }
              }}
            />
          </div>
          <div className="flex flex-col space-y-2">
            <Button
              type="submit"
              disabled={!input.trim() || isLoading}
              className="bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600"
            >
              <Send className="h-4 w-4" />
            </Button>
            <Button type="button" variant="outline" className="border-gray-600 hover:bg-gray-700/50 bg-transparent">
              <Mic className="h-4 w-4" />
            </Button>
            <Button type="button" variant="outline" className="border-gray-600 hover:bg-gray-700/50 bg-transparent">
              <Upload className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </form>
    </div>
  )
}
