"use client"

import { useState, useCallback } from "react"

export interface ChatMessage {
  id: string
  content: string
  isUser: boolean
  timestamp: Date
  source?: string
}

export interface Conversation {
  id: string
  title: string
  messages: ChatMessage[]
  createdAt: Date
  updatedAt: Date
}

export interface UserMemory {
  totalSessions: number
  lastSessionDate: Date | null
  lastCharacter: string | null
  lastPlay: string | null
  lastGenre: string | null
  favoriteScenes: string[]
  recentPlays: string[]
  skillLevel: "beginner" | "intermediate" | "advanced"
  preferences: {
    voiceEnabled: boolean
    autoScroll: boolean
    showSuggestions: boolean
  }
}

const defaultMemory: UserMemory = {
  totalSessions: 0,
  lastSessionDate: null,
  lastCharacter: null,
  lastPlay: null,
  lastGenre: null,
  favoriteScenes: [],
  recentPlays: [],
  skillLevel: "beginner",
  preferences: {
    voiceEnabled: true,
    autoScroll: true,
    showSuggestions: true,
  },
}

export function useConversations() {
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [currentConversationId, setCurrentConversationId] = useState<string | null>(null)
  const [memory, setMemory] = useState<UserMemory>(defaultMemory)

  const getCurrentConversation = useCallback(() => {
    if (!currentConversationId) return null
    return conversations.find((conv) => conv.id === currentConversationId) || null
  }, [conversations, currentConversationId])

  const createConversation = useCallback((initialMessage?: ChatMessage) => {
    const newConversation: Conversation = {
      id: Date.now().toString(),
      title: initialMessage?.content.slice(0, 50) + "..." || "New Conversation",
      messages: initialMessage ? [initialMessage] : [],
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    setConversations((prev) => [newConversation, ...prev])
    setCurrentConversationId(newConversation.id)

    // Update memory
    setMemory((prev) => ({
      ...prev,
      totalSessions: prev.totalSessions + 1,
      lastSessionDate: new Date(),
    }))

    return newConversation.id
  }, [])

  const addMessage = useCallback(
    (message: ChatMessage | string, conversationId?: string, isUser = true) => {
      const targetId = conversationId || currentConversationId
      if (!targetId) return

      const newMessage: ChatMessage =
        typeof message === "string"
          ? {
              id: Date.now().toString(),
              content: message,
              isUser,
              timestamp: new Date(),
            }
          : message

      setConversations((prev) =>
        prev.map((conv) =>
          conv.id === targetId
            ? {
                ...conv,
                messages: [...conv.messages, newMessage],
                updatedAt: new Date(),
              }
            : conv,
        ),
      )
    },
    [currentConversationId],
  )

  const getPersonalizedGreeting = useCallback(() => {
    const greetings = [
      "Ready to bring your characters to life?",
      "Let's explore the depths of your next role!",
      "Time to rehearse and perfect your craft!",
      "Your stage awaits - what scene shall we work on?",
      "Let's dive into character development together!",
    ]

    if (memory.totalSessions > 0) {
      const returningGreetings = [
        `Welcome back! Ready for session #${memory.totalSessions + 1}?`,
        `Great to see you again! Let's continue your acting journey.`,
        `Back for more rehearsal? I love your dedication!`,
      ]
      return returningGreetings[Math.floor(Math.random() * returningGreetings.length)]
    }

    return greetings[Math.floor(Math.random() * greetings.length)]
  }, [memory.totalSessions])

  const updateMemory = useCallback((updates: Partial<UserMemory>) => {
    setMemory((prev) => ({ ...prev, ...updates }))
  }, [])

  return {
    conversations,
    currentConversationId,
    getCurrentConversation,
    createConversation,
    addMessage,
    memory,
    getPersonalizedGreeting,
    updateMemory,
    setCurrentConversationId,
  }
}
