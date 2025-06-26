"use client"

import { motion } from "framer-motion"
import { MessageSquare, Clock, Star } from "lucide-react"

const recentConversations = [
  {
    id: 1,
    title: "Romeo & Juliet - Balcony Scene",
    preview: "But soft, what light through yonder window breaks...",
    timestamp: "2 hours ago",
    starred: true,
  },
  {
    id: 2,
    title: "Hamlet Character Analysis",
    preview: "Exploring Hamlet's internal conflict and motivation...",
    timestamp: "Yesterday",
    starred: false,
  },
  {
    id: 3,
    title: "Improv: Detective Scene",
    preview: "You played the detective investigating a mysterious...",
    timestamp: "3 days ago",
    starred: true,
  },
  {
    id: 4,
    title: "Macbeth Monologue Practice",
    preview: "Tomorrow, and tomorrow, and tomorrow...",
    timestamp: "1 week ago",
    starred: false,
  },
]

export function RecentConversations() {
  return (
    <motion.div
      className="w-80 bg-gray-900/30 backdrop-blur-sm border-r border-gray-800/50 p-6 overflow-y-auto"
      initial={{ x: -100, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.6, delay: 0.5 }}
    >
      <div className="mb-6">
        <h3 className="text-white font-semibold mb-2 flex items-center">
          <Clock className="w-4 h-4 mr-2 text-pink-400" />
          Recent Sessions
        </h3>
        <p className="text-gray-400 text-sm">Continue where you left off</p>
      </div>

      <div className="space-y-3">
        {recentConversations.map((conversation, index) => (
          <motion.button
            key={conversation.id}
            className="w-full p-3 bg-gray-800/30 hover:bg-gray-800/50 rounded-lg text-left transition-colors group"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 + index * 0.1 }}
            whileHover={{ scale: 1.02 }}
          >
            <div className="flex items-start justify-between mb-2">
              <div className="flex items-center space-x-2">
                <MessageSquare className="w-4 h-4 text-pink-400 flex-shrink-0" />
                <h4 className="text-white text-sm font-medium truncate">{conversation.title}</h4>
              </div>
              {conversation.starred && <Star className="w-3 h-3 text-yellow-400 fill-current flex-shrink-0" />}
            </div>
            <p className="text-gray-400 text-xs leading-relaxed mb-2 line-clamp-2">{conversation.preview}</p>
            <p className="text-gray-500 text-xs">{conversation.timestamp}</p>
          </motion.button>
        ))}
      </div>
    </motion.div>
  )
}
