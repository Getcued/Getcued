"use client"

import { useState, useEffect, useCallback } from "react"

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
  preview: string
  lastCharacter?: string
  lastPlay?: string
  lastGenre?: string
  rehearsalType?: string
}

export interface CuedMemory {
  lastCharacter?: string
  lastPlay?: string
  lastGenre?: string
  rehearsalType?: string
  favoriteScenes: string[]
  recentPlays: string[]
  favoriteGenres: string[]
  totalSessions: number
  lastSessionDate?: Date
  hasSeenOnboarding: boolean
}

const STORAGE_KEY = "cued-conversations"
const MEMORY_KEY = "cued-memory"

export function useConversations() {
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [currentConversationId, setCurrentConversationId] = useState<string | null>(null)
  const [memory, setMemory] = useState<CuedMemory>({
    favoriteScenes: [],
    recentPlays: [],
    favoriteGenres: [],
    totalSessions: 0,
    hasSeenOnboarding: false,
  })

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
          favoriteScenes: [],
          recentPlays: [],
          favoriteGenres: [],
          totalSessions: 0,
          hasSeenOnboarding: false,
          ...parsedMemory,
          lastSessionDate: parsedMemory.lastSessionDate ? new Date(parsedMemory.lastSessionDate) : undefined,
        })
      }
    } catch (error) {
      console.error("Failed to load conversations or memory:", error)
    }
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
  const saveMemory = useCallback((mem: CuedMemory) => {
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
    (firstMessage: ChatMessage): string => {
      const id = Date.now().toString()
      const title = generateTitle(firstMessage.content)
      const preview = firstMessage.content.substring(0, 100) + (firstMessage.content.length > 100 ? "..." : "")

      // Extract memory information
      const memoryInfo = extractMemoryFromMessage(firstMessage.content)

      const newConversation: Conversation = {
        id,
        title,
        messages: [firstMessage],
        createdAt: new Date(),
        updatedAt: new Date(),
        preview,
        ...memoryInfo,
      }

      const updatedConversations = [newConversation, ...conversations]
      setConversations(updatedConversations)
      setCurrentConversationId(id)
      saveConversations(updatedConversations)

      // Update memory
      const updatedMemory: CuedMemory = {
        ...memory,
        ...memoryInfo,
        totalSessions: memory.totalSessions + 1,
        lastSessionDate: new Date(),
        recentPlays: memoryInfo.play
          ? [memoryInfo.play, ...memory.recentPlays.filter((p) => p !== memoryInfo.play)].slice(0, 5)
          : memory.recentPlays,
        favoriteGenres:
          memoryInfo.genre && !memory.favoriteGenres.includes(memoryInfo.genre)
            ? [...memory.favoriteGenres, memoryInfo.genre]
            : memory.favoriteGenres,
      }
      saveMemory(updatedMemory)

      return id
    },
    [conversations, generateTitle, saveConversations, extractMemoryFromMessage, memory, saveMemory],
  )

  // Add message to current conversation
  const addMessage = useCallback(
    (message: ChatMessage, conversationId?: string) => {
      const targetId = conversationId || currentConversationId
      if (!targetId) return

      setConversations((prev) => {
        const updated = prev.map((conv) => {
          if (conv.id === targetId) {
            const updatedMessages = [...conv.messages, message]

            // Update conversation memory if it's a user message
            let updatedConv = {
              ...conv,
              messages: updatedMessages,
              updatedAt: new Date(),
              preview: message.content.substring(0, 100) + (message.content.length > 100 ? "..." : ""),
            }

            if (message.isUser) {
              const memoryInfo = extractMemoryFromMessage(message.content)
              updatedConv = { ...updatedConv, ...memoryInfo }

              // Update global memory too
              if (memoryInfo.play || memoryInfo.genre) {
                const updatedMemory: CuedMemory = {
                  ...memory,
                  ...memoryInfo,
                  recentPlays: memoryInfo.play
                    ? [memoryInfo.play, ...memory.recentPlays.filter((p) => p !== memoryInfo.play)].slice(0, 5)
                    : memory.recentPlays,
                  favoriteGenres:
                    memoryInfo.genre && !memory.favoriteGenres.includes(memoryInfo.genre)
                      ? [...memory.favoriteGenres, memoryInfo.genre]
                      : memory.favoriteGenres,
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
  const getCurrentConversation = useCallback((): Conversation | null => {
    if (!currentConversationId) return null
    return conversations.find((conv) => conv.id === currentConversationId) || null
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
  const getPersonalizedGreeting = useCallback((): string => {
    if (memory.totalSessions === 0) {
      return "Choose a scene below or describe what you'd like to rehearse."
    }

    const greetings = []

    if (memory.lastCharacter && memory.lastPlay) {
      greetings.push(
        `Welcome back! Last time we worked on ${memory.lastCharacter} from ${memory.lastPlay}. Would you like to continue with that character or try something new?`,
      )
    } else if (memory.lastCharacter) {
      greetings.push(
        `Good to see you again! I remember we were working on the character ${memory.lastCharacter}. Ready to dive deeper into that role?`,
      )
    } else if (memory.lastPlay) {
      greetings.push(
        `Welcome back! I see we were exploring ${memory.lastPlay} last time. Which character would you like to work on today?`,
      )
    }

    if (memory.rehearsalType) {
      greetings.push(`Ready for more ${memory.rehearsalType}? I'm here to help you perfect your craft!`)
    }

    if (memory.totalSessions > 5) {
      greetings.push(
        `Great to see a dedicated actor! This is session #${memory.totalSessions + 1}. What scene shall we bring to life today?`,
      )
    }

    return greetings.length > 0
      ? greetings[Math.floor(Math.random() * greetings.length)]
      : `Welcome back! Ready for session #${memory.totalSessions + 1}? Let's create some magic together!`
  }, [memory])

  return {
    conversations,
    currentConversationId,
    memory,
    getCurrentConversation,
    createConversation,
    addMessage,
    switchToConversation,
    startNewConversation,
    deleteConversation,
    renameConversation,
    clearAllConversations,
    getPersonalizedGreeting,
    saveMemory,
  }
}
