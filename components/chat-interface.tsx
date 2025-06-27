"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Send, Mic, Upload } from "lucide-react"
import EmojiReactions from "@/components/emoji-reactions"

interface Message {
  id: string
  content: string
  sender: "user" | "ai"
  timestamp: Date
}

const scriptSuggestions = [
  "Let's rehearse the balcony scene from Romeo and Juliet",
  "Practice Hamlet's 'To be or not to be' soliloquy",
  "Work on Lady Macbeth's sleepwalking scene",
  "Rehearse Blanche's final scene from A Streetcar Named Desire",
]

const getAIResponse = (userMessage: string): string => {
  const message = userMessage.toLowerCase()

  if (message.includes("romeo") || message.includes("juliet") || message.includes("balcony")) {
    return "Perfect choice! Let's work on the balcony scene. I'll play Romeo. Start with Juliet's entrance: 'O Romeo, Romeo, wherefore art thou Romeo?' Remember to convey the longing and conflict in her voice."
  }

  if (message.includes("hamlet") || message.includes("to be or not to be")) {
    return "Excellent! Hamlet's most famous soliloquy. This is about life, death, and the fear of the unknown. Start slowly, build the internal conflict. Begin: 'To be or not to be, that is the question...'"
  }

  if (message.includes("macbeth") || message.includes("lady macbeth") || message.includes("sleepwalking")) {
    return "Great choice! Lady Macbeth's sleepwalking scene shows her guilt consuming her. She's reliving the murders. Start with fragmented, haunted delivery: 'Out, damned spot! Out, I say!'"
  }

  if (message.includes("streetcar") || message.includes("blanche")) {
    return "Powerful scene! Blanche's final moments show her complete break from reality. She's clinging to illusion as her last defense. Begin with vulnerability: 'I have always depended on the kindness of strangers.'"
  }

  return "I'm here to help you rehearse! Try one of the script suggestions above, or tell me what scene you'd like to work on. I can play any character and give you feedback on your performance."
}

export default function ChatInterface() {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)

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

    // Simulate AI response delay
    setTimeout(() => {
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        content: getAIResponse(input),
        sender: "ai",
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, aiResponse])
      setIsLoading(false)
    }, 1000)
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
    <div className="max-w-4xl mx-auto px-4">
      <div className="bg-gray-900 rounded-lg border border-gray-800 overflow-hidden">
        {/* Header */}
        <div className="bg-gray-800 px-6 py-4 border-b border-gray-700">
          <h2 className="text-xl font-semibold text-white">AI Rehearsal Partner</h2>
          <p className="text-gray-400 text-sm">Start rehearsing with your AI scene partner</p>
        </div>

        {/* Messages */}
        <div className="h-96 overflow-y-auto p-6 space-y-4">
          {messages.length === 0 && (
            <div className="text-center text-gray-500 py-8">
              <p>Welcome to your AI rehearsal partner!</p>
              <p className="text-sm mt-2">Choose a script suggestion below or start your own scene.</p>
            </div>
          )}

          {messages.map((message) => (
            <div key={message.id} className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}>
              <div
                className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                  message.sender === "user" ? "bg-pink-600 text-white" : "bg-gray-700 text-gray-100"
                }`}
              >
                <p className="text-sm">{message.content}</p>
                <EmojiReactions message={message.content} />
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-gray-700 text-gray-100 px-4 py-2 rounded-lg">
                <p className="text-sm">AI is thinking...</p>
              </div>
            </div>
          )}
        </div>

        {/* Script Suggestions */}
        {messages.length === 0 && (
          <div className="px-6 py-4 border-t border-gray-700">
            <p className="text-sm text-gray-400 mb-3">Popular scenes to rehearse:</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {scriptSuggestions.map((suggestion, index) => (
                <Button
                  key={index}
                  variant="outline"
                  size="sm"
                  onClick={() => handleSuggestionClick(suggestion)}
                  className="text-left justify-start h-auto py-2 px-3 text-xs bg-gray-800 border-gray-600 text-gray-300 hover:bg-gray-700 hover:text-white"
                >
                  {suggestion}
                </Button>
              ))}
            </div>
          </div>
        )}

        {/* Input */}
        <div className="p-6 border-t border-gray-700">
          <div className="flex space-x-2">
            <Textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type your message or choose a script suggestion..."
              className="flex-1 bg-gray-800 border-gray-600 text-white placeholder-gray-400 resize-none"
              rows={2}
            />
            <div className="flex flex-col space-y-2">
              <Button
                onClick={handleSend}
                disabled={!input.trim() || isLoading}
                size="sm"
                className="bg-pink-600 hover:bg-pink-700 text-white"
              >
                <Send className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="border-gray-600 text-gray-400 hover:text-white hover:bg-gray-700 bg-transparent"
              >
                <Mic className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="border-gray-600 text-gray-400 hover:text-white hover:bg-gray-700 bg-transparent"
              >
                <Upload className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
