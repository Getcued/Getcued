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
}

const STORAGE_KEY = "cued-conversations"

export function useConversations() {
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [currentConversationId, setCurrentConversationId] = useState<string | null>(null)

  // Load conversations from localStorage on mount
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
    } catch (error) {
      console.error("Failed to load conversations:", error)
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

      const newConversation: Conversation = {
        id,
        title,
        messages: [firstMessage],
        createdAt: new Date(),
        updatedAt: new Date(),
        preview,
      }

      const updatedConversations = [newConversation, ...conversations]
      setConversations(updatedConversations)
      setCurrentConversationId(id)
      saveConversations(updatedConversations)

      return id
    },
    [conversations, generateTitle, saveConversations],
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
            return {
              ...conv,
              messages: updatedMessages,
              updatedAt: new Date(),
              preview: message.content.substring(0, 100) + (message.content.length > 100 ? "..." : ""),
            }
          }
          return conv
        })

        saveConversations(updated)
        return updated
      })
    },
    [currentConversationId, saveConversations],
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
  }
}
