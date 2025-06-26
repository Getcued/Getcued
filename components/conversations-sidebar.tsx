"use client"

import type React from "react"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  MessageSquare,
  Plus,
  MoreHorizontal,
  Edit3,
  Trash2,
  Check,
  X,
  Calendar,
  Clock,
  Search,
  Archive,
} from "lucide-react"
import { useDynamicPosition } from "@/hooks/use-dynamic-position"
import type { Conversation } from "@/hooks/use-conversations"

interface ConversationsSidebarProps {
  conversations: Conversation[]
  currentConversationId: string | null
  onSelectConversation: (id: string) => void
  onNewConversation: () => void
  onDeleteConversation: (id: string) => void
  onRenameConversation: (id: string, newTitle: string) => void
  onClearAll: () => void
}

interface ConversationItemProps {
  conversation: Conversation
  isActive: boolean
  onSelect: () => void
  onDelete: () => void
  onRename: (newTitle: string) => void
}

function ConversationItem({ conversation, isActive, onSelect, onDelete, onRename }: ConversationItemProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [editTitle, setEditTitle] = useState(conversation.title)
  const [showMenu, setShowMenu] = useState(false)

  const { triggerRef, contentRef, position, isVisible, setIsVisible } = useDynamicPosition({
    offset: 8,
    preferredPosition: "right",
  })

  const handleRename = () => {
    if (editTitle.trim() && editTitle.trim() !== conversation.title) {
      onRename(editTitle.trim())
    }
    setIsEditing(false)
    setShowMenu(false)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleRename()
    } else if (e.key === "Escape") {
      setEditTitle(conversation.title)
      setIsEditing(false)
    }
  }

  const formatDate = (date: Date) => {
    const now = new Date()
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60)

    if (diffInHours < 24) {
      return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    } else if (diffInHours < 168) {
      // Less than a week
      return date.toLocaleDateString([], { weekday: "short" })
    } else {
      return date.toLocaleDateString([], { month: "short", day: "numeric" })
    }
  }

  return (
    <motion.div
      className={`group relative p-3 rounded-lg cursor-pointer transition-all duration-200 ${
        isActive
          ? "bg-gradient-to-r from-pink-500/20 to-purple-600/20 border border-pink-500/30"
          : "hover:bg-gray-800/50 border border-transparent"
      }`}
      onClick={onSelect}
      whileHover={{ scale: 1.01 }}
      whileTap={{ scale: 0.99 }}
      layout
    >
      <div className="flex items-start justify-between">
        <div className="flex-1 min-w-0">
          {isEditing ? (
            <div className="flex items-center space-x-2" onClick={(e) => e.stopPropagation()}>
              <Input
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                onKeyDown={handleKeyDown}
                className="h-6 text-sm bg-gray-800 border-gray-600"
                autoFocus
              />
              <Button variant="ghost" size="sm" onClick={handleRename} className="h-6 w-6 p-0">
                <Check className="w-3 h-3" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setEditTitle(conversation.title)
                  setIsEditing(false)
                }}
                className="h-6 w-6 p-0"
              >
                <X className="w-3 h-3" />
              </Button>
            </div>
          ) : (
            <>
              <div className="flex items-center space-x-2 mb-1">
                <MessageSquare className="w-4 h-4 text-pink-400 flex-shrink-0" />
                <h4 className="text-white text-sm font-medium truncate">{conversation.title}</h4>
              </div>
              <p className="text-gray-400 text-xs leading-relaxed line-clamp-2 mb-2">{conversation.preview}</p>
              <div className="flex items-center justify-between">
                <span className="text-gray-500 text-xs flex items-center">
                  <Clock className="w-3 h-3 mr-1" />
                  {formatDate(conversation.updatedAt)}
                </span>
                <span className="text-gray-500 text-xs">{conversation.messages.length} messages</span>
              </div>
            </>
          )}
        </div>

        {!isEditing && (
          <Button
            ref={triggerRef}
            variant="ghost"
            size="sm"
            onClick={(e) => {
              e.stopPropagation()
              setIsVisible(!isVisible)
            }}
            className="opacity-0 group-hover:opacity-100 transition-opacity p-1 h-6 w-6 text-gray-400 hover:text-white"
          >
            <MoreHorizontal className="w-4 h-4" />
          </Button>
        )}
      </div>

      {/* Context Menu */}
      <AnimatePresence>
        {isVisible && (
          <>
            <motion.div
              className="fixed inset-0 z-40"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsVisible(false)}
            />
            <motion.div
              ref={contentRef}
              className="fixed z-50 bg-gray-800 border border-gray-600 rounded-lg shadow-xl py-1 min-w-[120px]"
              style={{
                top: position.top,
                bottom: position.bottom,
                left: position.left,
                right: position.right,
              }}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => {
                  setIsEditing(true)
                  setIsVisible(false)
                }}
                className="w-full px-3 py-2 text-left text-sm text-gray-300 hover:bg-gray-700 hover:text-white flex items-center space-x-2"
              >
                <Edit3 className="w-4 h-4" />
                <span>Rename</span>
              </button>
              <button
                onClick={() => {
                  onDelete()
                  setIsVisible(false)
                }}
                className="w-full px-3 py-2 text-left text-sm text-red-400 hover:bg-red-900/20 hover:text-red-300 flex items-center space-x-2"
              >
                <Trash2 className="w-4 h-4" />
                <span>Delete</span>
              </button>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

export function ConversationsSidebar({
  conversations,
  currentConversationId,
  onSelectConversation,
  onNewConversation,
  onDeleteConversation,
  onRenameConversation,
  onClearAll,
}: ConversationsSidebarProps) {
  const [searchQuery, setSearchQuery] = useState("")

  const filteredConversations = conversations.filter(
    (conv) =>
      conv.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      conv.preview.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  // Group conversations by date
  const groupedConversations = filteredConversations.reduce(
    (groups, conv) => {
      const now = new Date()
      const convDate = conv.updatedAt
      const diffInHours = (now.getTime() - convDate.getTime()) / (1000 * 60 * 60)

      let group: string
      if (diffInHours < 24) {
        group = "Today"
      } else if (diffInHours < 48) {
        group = "Yesterday"
      } else if (diffInHours < 168) {
        group = "This Week"
      } else if (diffInHours < 720) {
        group = "This Month"
      } else {
        group = "Older"
      }

      if (!groups[group]) {
        groups[group] = []
      }
      groups[group].push(conv)
      return groups
    },
    {} as Record<string, Conversation[]>,
  )

  const groupOrder = ["Today", "Yesterday", "This Week", "This Month", "Older"]

  return (
    <motion.div
      className="w-80 bg-gray-900/30 backdrop-blur-sm border-r border-gray-800/50 flex flex-col h-full"
      initial={{ x: -100, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.6, delay: 0.2 }}
    >
      {/* Header */}
      <div className="p-4 border-b border-gray-800/50">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-white font-semibold flex items-center">
            <MessageSquare className="w-5 h-5 mr-2 text-pink-400" />
            Conversations
          </h3>
          <Button
            onClick={onNewConversation}
            size="sm"
            className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 h-8 w-8 p-0"
          >
            <Plus className="w-4 h-4" />
          </Button>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search conversations..."
            className="pl-10 bg-gray-800/50 border-gray-600 text-white placeholder-gray-400 h-9"
          />
        </div>
      </div>

      {/* Conversations List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {conversations.length === 0 ? (
          <div className="text-center py-8">
            <MessageSquare className="w-12 h-12 text-gray-600 mx-auto mb-4" />
            <p className="text-gray-400 text-sm">No conversations yet</p>
            <p className="text-gray-500 text-xs mt-1">Start a new scene to begin</p>
          </div>
        ) : filteredConversations.length === 0 ? (
          <div className="text-center py-8">
            <Search className="w-12 h-12 text-gray-600 mx-auto mb-4" />
            <p className="text-gray-400 text-sm">No conversations found</p>
            <p className="text-gray-500 text-xs mt-1">Try a different search term</p>
          </div>
        ) : (
          <AnimatePresence>
            {groupOrder.map((groupName) => {
              const groupConversations = groupedConversations[groupName]
              if (!groupConversations || groupConversations.length === 0) return null

              return (
                <motion.div
                  key={groupName}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="space-y-2"
                >
                  <div className="flex items-center space-x-2 px-2 py-1">
                    <Calendar className="w-3 h-3 text-gray-500" />
                    <h4 className="text-gray-400 text-xs font-medium uppercase tracking-wider">{groupName}</h4>
                  </div>
                  <div className="space-y-2">
                    {groupConversations.map((conversation) => (
                      <ConversationItem
                        key={conversation.id}
                        conversation={conversation}
                        isActive={conversation.id === currentConversationId}
                        onSelect={() => onSelectConversation(conversation.id)}
                        onDelete={() => onDeleteConversation(conversation.id)}
                        onRename={(newTitle) => onRenameConversation(conversation.id, newTitle)}
                      />
                    ))}
                  </div>
                </motion.div>
              )
            })}
          </AnimatePresence>
        )}
      </div>

      {/* Footer */}
      {conversations.length > 0 && (
        <div className="p-4 border-t border-gray-800/50">
          <Button
            onClick={onClearAll}
            variant="ghost"
            size="sm"
            className="w-full text-gray-400 hover:text-red-400 hover:bg-red-900/20 flex items-center space-x-2"
          >
            <Archive className="w-4 h-4" />
            <span>Clear All Conversations</span>
          </Button>
        </div>
      )}
    </motion.div>
  )
}
