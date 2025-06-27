"use client"

import { useState, useEffect } from "react"

export interface ChatMessage {
  id: string
  content: string
  isUser: boolean
  timestamp: Date
  source?: string
}

export interface Conversation {
  id: string
  messages: ChatMessage[]
  createdAt: Date
  updatedAt: Date
}

export interface CuedMemory {
  totalSessions: number
  lastPlay?: string
  lastCharacter?: string
  lastGenre?: string
  favoriteScenes: string[]
  recentPlays: string[]
  favoriteGenres: string[]
  sessionHistory: Array<{
    date: Date
    play?: string
    character?: string
    genre?: string
  }>
}

const STORAGE_KEY = "cued-conversations"
const MEMORY_KEY = "cued-memory"

export function useConversations() {
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [currentConversationId, setCurrentConversationId] = useState<string | null>(null)
  const [memory, setMemory] = useState<CuedMemory>({
    totalSessions: 0,
    favoriteScenes: [],
    recentPlays: [],
    favoriteGenres: [],
    sessionHistory: [],
  })

  // Load conversations and memory from localStorage
  useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        const savedConversations = localStorage.getItem(STORAGE_KEY)
        if (savedConversations) {
          const parsed = JSON.parse(savedConversations)
          setConversations(
            parsed.map((conv: any) => ({
              ...conv,
              createdAt: new Date(conv.createdAt),
              updatedAt: new Date(conv.updatedAt),
              messages: conv.messages.map((msg: any) => ({
                ...msg,
                timestamp: new Date(msg.timestamp),
              })),
            })),
          )
        }

        const savedMemory = localStorage.getItem(MEMORY_KEY)
        if (savedMemory) {
          const parsed = JSON.parse(savedMemory)
          setMemory({
            ...parsed,
            sessionHistory:
              parsed.sessionHistory?.map((session: any) => ({
                ...session,
                date: new Date(session.date),
              })) || [],
          })
        }
      } catch (error) {
        console.error("Error loading conversations:", error)
      }
    }
  }, [])

  // Save conversations to localStorage
  useEffect(() => {
    if (typeof window !== "undefined" && conversations.length > 0) {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(conversations))
      } catch (error) {
        console.error("Error saving conversations:", error)
      }
    }
  }, [conversations])

  // Save memory to localStorage
  useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        localStorage.setItem(MEMORY_KEY, JSON.stringify(memory))
      } catch (error) {
        console.error("Error saving memory:", error)
      }
    }
  }, [memory])

  const getCurrentConversation = () => {
    return conversations.find((conv) => conv.id === currentConversationId) || null
  }

  const createConversation = (initialMessage?: ChatMessage) => {
    const newConversation: Conversation = {
      id: Date.now().toString(),
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
      sessionHistory: [
        {
          date: new Date(),
          play: undefined,
          character: undefined,
          genre: undefined,
        },
        ...prev.sessionHistory.slice(0, 9), // Keep last 10 sessions
      ],
    }))

    return newConversation.id
  }

  const addMessage = (message: ChatMessage, conversationId?: string) => {
    const targetId = conversationId || currentConversationId
    if (!targetId) return

    setConversations((prev) =>
      prev.map((conv) =>
        conv.id === targetId
          ? {
              ...conv,
              messages: [...conv.messages, message],
              updatedAt: new Date(),
            }
          : conv,
      ),
    )

    // Update memory based on message content
    if (!message.isUser) {
      updateMemoryFromMessage(message.content)
    }
  }

  const updateMemoryFromMessage = (content: string) => {
    const lowerContent = content.toLowerCase()
    const updates: Partial<CuedMemory> = {}

    // Detect plays
    if (lowerContent.includes("romeo") || lowerContent.includes("juliet")) {
      updates.lastPlay = "Romeo and Juliet"
      updates.lastGenre = "Shakespeare"
    } else if (lowerContent.includes("hamlet")) {
      updates.lastPlay = "Hamlet"
      updates.lastGenre = "Shakespeare"
    } else if (lowerContent.includes("macbeth")) {
      updates.lastPlay = "Macbeth"
      updates.lastGenre = "Shakespeare"
    } else if (lowerContent.includes("streetcar")) {
      updates.lastPlay = "A Streetcar Named Desire"
      updates.lastGenre = "Drama"
    }

    // Detect characters
    if (lowerContent.includes("romeo")) {
      updates.lastCharacter = "Romeo"
    } else if (lowerContent.includes("juliet")) {
      updates.lastCharacter = "Juliet"
    } else if (lowerContent.includes("hamlet")) {
      updates.lastCharacter = "Hamlet"
    } else if (lowerContent.includes("lady macbeth")) {
      updates.lastCharacter = "Lady Macbeth"
    } else if (lowerContent.includes("blanche")) {
      updates.lastCharacter = "Blanche DuBois"
    }

    if (Object.keys(updates).length > 0) {
      setMemory((prev) => {
        const newMemory = { ...prev, ...updates }

        // Update recent plays
        if (updates.lastPlay && !prev.recentPlays.includes(updates.lastPlay)) {
          newMemory.recentPlays = [updates.lastPlay, ...prev.recentPlays.slice(0, 4)]
        }

        // Update favorite genres
        if (updates.lastGenre && !prev.favoriteGenres.includes(updates.lastGenre)) {
          newMemory.favoriteGenres = [updates.lastGenre, ...prev.favoriteGenres.slice(0, 2)]
        }

        return newMemory
      })
    }
  }

  const updateMemory = (updates: Partial<CuedMemory>) => {
    setMemory((prev) => ({ ...prev, ...updates }))
  }

  const getPersonalizedGreeting = () => {
    if (memory.totalSessions === 0) {
      return "Choose a scene to start your first rehearsal, or describe what you'd like to work on."
    }

    if (memory.lastCharacter && memory.lastPlay) {
      return `Welcome back! Ready to continue with ${memory.lastCharacter} from ${memory.lastPlay}, or try something new?`
    }

    if (memory.lastPlay) {
      return `Welcome back! Want to continue with ${memory.lastPlay} or explore a different play?`
    }

    if (memory.favoriteGenres.length > 0) {
      return `Welcome back! Ready for more ${memory.favoriteGenres[0]} scenes, or try something different?`
    }

    return `Welcome back! What would you like to rehearse today?`
  }

  const deleteConversation = (conversationId: string) => {
    setConversations((prev) => prev.filter((conv) => conv.id !== conversationId))
    if (currentConversationId === conversationId) {
      setCurrentConversationId(null)
    }
  }

  const clearAllConversations = () => {
    setConversations([])
    setCurrentConversationId(null)
    if (typeof window !== "undefined") {
      localStorage.removeItem(STORAGE_KEY)
    }
  }

  return {
    conversations,
    currentConversationId,
    getCurrentConversation,
    createConversation,
    addMessage,
    deleteConversation,
    clearAllConversations,
    setCurrentConversationId,
    memory,
    updateMemory,
    getPersonalizedGreeting,
  }
}
