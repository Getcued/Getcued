"use client"

import { useState, useEffect, useCallback } from "react"

export interface Message {
  id: string
  content: string
  sender: "user" | "ai"
  timestamp: Date
}

export interface Conversation {
  id: string
  messages: Message[]
  createdAt: Date
  updatedAt: Date
}

export interface Memory {
  totalSessions: number
  lastPlay?: string
  lastCharacter?: string
  lastGenre?: string
  preferences: string[]
}

const STORAGE_KEY = "cued-conversations"
const MEMORY_KEY = "cued-memory"

export function useConversations() {
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [currentConversationId, setCurrentConversationId] = useState<string | null>(null)
  const [memory, setMemory] = useState<Memory>({
    totalSessions: 0,
    preferences: [],
  })
  const [isLoading, setIsLoading] = useState(true)

  // Load conversations and memory from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      if (saved) {
        const parsed = JSON.parse(saved)
        const conversationsWithDates = parsed.map((conv: any) => ({
          ...conv,
          createdAt: new Date(conv.createdAt),
          updatedAt: new Date(conv.updatedAt),
          messages: conv.messages.map((msg: any) => ({
            ...msg,
            timestamp: new Date(msg.timestamp),
          })),
        }))
        setConversations(conversationsWithDates)
      }

      // Load memory
      const savedMemory = localStorage.getItem(MEMORY_KEY)
      if (savedMemory) {
        const parsedMemory = JSON.parse(savedMemory)
        setMemory({
          totalSessions: 0,
          preferences: [],
          ...parsedMemory,
          lastSessionDate: parsedMemory.lastSessionDate ? new Date(parsedMemory.lastSessionDate) : undefined,
        })
      }
    } catch (error) {
      console.error("Failed to load conversations or memory:", error)
    }
    setIsLoading(false)
  }, [])

  // Save conversations to localStorage whenever they change
  const saveConversations = useCallback((convs: Conversation[]) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(convs))
    } catch (error) {
      console.error("Failed to save conversations:", error)
    }
  }, [])

  // Save memory to localStorage
  const saveMemory = useCallback((mem: Memory) => {
    try {
      localStorage.setItem(MEMORY_KEY, JSON.stringify(mem))
      setMemory(mem)
    } catch (error) {
      console.error("Failed to save memory:", error)
    }
  }, [])

  // Extract character and play information from message
  const extractMemoryFromMessage = useCallback((content: string) => {
    const lowerContent = content.toLowerCase()
    let character = ""
    let play = ""
    let genre = ""
    let rehearsalType = ""

    // Extract character names
    const characterPatterns = [
      /(?:i'm|i am|playing|rehearsing|practicing)\s+([a-z\s]+?)(?:\s+from|\s+in|$)/i,
      /(?:character|role)\s+(?:of\s+)?([a-z\s]+?)(?:\s+from|\s+in|$)/i,
      /(?:be|play)\s+([a-z\s]+?)(?:\s+from|\s+in|$)/i,
    ]

    for (const pattern of characterPatterns) {
      const match = content.match(pattern)
      if (match && match[1]) {
        character = match[1].trim()
        break
      }
    }

    // Extract play names
    const playPatterns = [
      /(?:from|in)\s+([a-z\s&]+?)(?:\s+by|\s+act|\s+scene|$)/i,
      /(hamlet|macbeth|romeo and juliet|othello|king lear|julius caesar|a midsummer night's dream|the tempest|much ado about nothing|as you like it)/i,
      /(death of a salesman|a streetcar named desire|the glass menagerie|who's afraid of virginia woolf|long day's journey into night)/i,
    ]

    for (const pattern of playPatterns) {
      const match = content.match(pattern)
      if (match && match[1]) {
        play = match[1].trim()
        break
      }
    }

    // Determine genre
    if (
      lowerContent.includes("shakespeare") ||
      ["hamlet", "macbeth", "romeo and juliet", "othello"].some((p) => lowerContent.includes(p))
    ) {
      genre = "Shakespeare"
    } else if (lowerContent.includes("musical") || lowerContent.includes("song")) {
      genre = "Musical"
    } else if (lowerContent.includes("comedy")) {
      genre = "Comedy"
    } else if (lowerContent.includes("drama")) {
      genre = "Drama"
    }

    // Determine rehearsal type
    if (lowerContent.includes("monologue")) {
      rehearsalType = "monologue"
    } else if (lowerContent.includes("scene")) {
      rehearsalType = "scene"
    } else if (lowerContent.includes("improv")) {
      rehearsalType = "improv"
    } else if (lowerContent.includes("character")) {
      rehearsalType = "character work"
    }

    return { character, play, genre, rehearsalType }
  }, [])

  // Generate a title from the first user message
  const generateTitle = useCallback((firstMessage: string): string => {
    const cleaned = firstMessage.replace(/📎.*?\n\n/g, "").trim()
    if (cleaned.length <= 50) return cleaned
    return cleaned.substring(0, 47) + "..."
  }, [])

  // Create a new conversation
  const createConversation = useCallback(
    (initialMessage: Message) => {
      const newConversation: Conversation = {
        id: Date.now().toString(),
        messages: [initialMessage],
        createdAt: new Date(),
        updatedAt: new Date(),
      }

      const updatedConversations = [...conversations, newConversation]
      setConversations(updatedConversations)
      setCurrentConversationId(newConversation.id)
      saveConversations(updatedConversations)

      // Update memory
      setMemory((prev) => ({
        ...prev,
        totalSessions: prev.totalSessions + 1,
      }))

      return newConversation.id
    },
    [conversations, saveConversations],
  )

  // Add message to current conversation
  const addMessage = useCallback(
    (message: Message) => {
      if (!currentConversationId) return

      setConversations((prev) => {
        const updated = prev.map((conv) => {
          if (conv.id === currentConversationId) {
            const updatedMessages = [...conv.messages, message]

            // Update conversation memory if it's a user message
            let updatedConv = {
              ...conv,
              messages: updatedMessages,
              updatedAt: new Date(),
            }

            if (message.sender === "user") {
              const memoryInfo = extractMemoryFromMessage(message.content)
              updatedConv = { ...updatedConv, ...memoryInfo }

              // Update global memory too
              if (memoryInfo.play || memoryInfo.genre) {
                const updatedMemory: Memory = {
                  ...memory,
                  ...memoryInfo,
                  totalSessions: memory.totalSessions + 1,
                  lastSessionDate: new Date(),
                  preferences: memoryInfo.play
                    ? [memoryInfo.play, ...memory.preferences.filter((p) => p !== memoryInfo.play)].slice(0, 5)
                    : memory.preferences,
                }
                saveMemory(updatedMemory)
              }
            }

            return updatedConv
          }
          return conv
        })

        saveConversations(updated)
        return updated
      })
    },
    [currentConversationId, saveConversations, extractMemoryFromMessage, memory, saveMemory],
  )

  // Get current conversation
  const getCurrentConversation = useCallback(() => {
    if (!currentConversationId) return null
    return conversations.find((c) => c.id === currentConversationId) || null
  }, [conversations, currentConversationId])

  // Switch to a conversation
  const switchToConversation = useCallback((id: string) => {
    setCurrentConversationId(id)
  }, [])

  // Start a new conversation
  const startNewConversation = useCallback(() => {
    setCurrentConversationId(null)
  }, [])

  // Delete a conversation
  const deleteConversation = useCallback(
    (id: string) => {
      const updated = conversations.filter((conv) => conv.id !== id)
      setConversations(updated)
      saveConversations(updated)

      if (currentConversationId === id) {
        setCurrentConversationId(null)
      }
    },
    [conversations, currentConversationId, saveConversations],
  )

  // Rename a conversation
  const renameConversation = useCallback(
    (id: string, newTitle: string) => {
      const updated = conversations.map((conv) => (conv.id === id ? { ...conv, title: newTitle.trim() } : conv))
      setConversations(updated)
      saveConversations(updated)
    },
    [conversations, saveConversations],
  )

  // Clear all conversations
  const clearAllConversations = useCallback(() => {
    setConversations([])
    setCurrentConversationId(null)
    localStorage.removeItem(STORAGE_KEY)
  }, [])

  // Get personalized greeting based on memory
  const getPersonalizedGreeting = useCallback(() => {
    if (memory.totalSessions === 0) {
      return "Upload a script or choose from our suggestions to begin your first rehearsal."
    }

    if (memory.lastCharacter) {
      return `Ready to continue with ${memory.lastCharacter} or explore a new character?`
    }

    return "Welcome back! What would you like to rehearse today?"
  }, [memory])

  // Add conversation
  const addConversation = useCallback((title: string, firstMessage: string) => {
    const newConversation: Conversation = {
      id: Date.now().toString(),
      messages: [{ id: Date.now().toString(), content: firstMessage, sender: "user", timestamp: new Date() }],
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    setConversations((prev) => [...prev, newConversation])
    setCurrentConversationId(newConversation.id)

    // Update memory
    setMemory((prev) => ({
      ...prev,
      totalSessions: prev.totalSessions + 1,
    }))

    return newConversation.id
  }, [])

  // Update conversation
  const updateConversation = useCallback(
    (id: string, lastMessage: string) => {
      setConversations((prev) => {
        const updated = prev.map((conv) =>
          conv.id === id
            ? {
                ...conv,
                messages: [
                  ...conv.messages,
                  { id: Date.now().toString(), content: lastMessage, sender: "ai", timestamp: new Date() },
                ],
                updatedAt: new Date(),
              }
            : conv,
        )
        saveConversations(updated)
        return updated
      })
    },
    [saveConversations],
  )

  return {
    conversations,
    currentConversationId,
    getCurrentConversation,
    createConversation,
    addMessage,
    switchToConversation,
    startNewConversation,
    deleteConversation,
    renameConversation,
    clearAllConversations,
    memory,
    getPersonalizedGreeting,
    saveMemory,
    isLoading,
    addConversation,
    updateConversation,
  }
}
