"use client"

import type React from "react"

import { useState, useEffect, useRef, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import {
  Send,
  Mic,
  MicOff,
  Sparkles,
  Theater,
  Users,
  BookOpen,
  VolumeX,
  AlertCircle,
  Bot,
  Zap,
  Paperclip,
  X,
  FileText,
  ChevronDown,
  Clock,
  Heart,
} from "lucide-react"
import { useVoice } from "@/hooks/use-voice"
import { VoiceVisualizer } from "@/components/voice-visualizer"
import { VoiceSettings } from "@/components/voice-settings"
import { FileUploadZone } from "@/components/file-upload-zone"
import { EmojiReactions } from "@/components/emoji-reactions"
import { useConversations, type ChatMessage } from "@/hooks/use-conversations"

// Enhanced script suggestions with real plays and scenes
const scriptSuggestions = [
  {
    icon: Theater,
    title: "Romeo & Juliet - Balcony Scene",
    prompt: "Let's rehearse the balcony scene from Romeo and Juliet, Act 2 Scene 2. You be Romeo, I'll be Juliet.",
    play: "Romeo and Juliet",
    character: "Romeo/Juliet",
    genre: "Shakespeare",
  },
  {
    icon: Users,
    title: "Hamlet - To Be or Not To Be",
    prompt: "Help me work on Hamlet's famous soliloquy 'To be or not to be' from Act 3, Scene 1.",
    play: "Hamlet",
    character: "Hamlet",
    genre: "Shakespeare",
  },
  {
    icon: BookOpen,
    title: "Macbeth - Lady Macbeth Sleepwalking",
    prompt:
      "Let's practice Lady Macbeth's sleepwalking scene from Act 5, Scene 1. I need help with her guilt and madness.",
    play: "Macbeth",
    character: "Lady Macbeth",
    genre: "Shakespeare",
  },
  {
    icon: Sparkles,
    title: "A Streetcar Named Desire - Blanche",
    prompt:
      "I want to work on Blanche DuBois from A Streetcar Named Desire. Help me understand her vulnerability and delusion.",
    play: "A Streetcar Named Desire",
    character: "Blanche DuBois",
    genre: "Drama",
  },
  {
    icon: Theater,
    title: "Death of a Salesman - Willy Loman",
    prompt:
      "Let's explore Willy Loman's character from Death of a Salesman. I need help with his desperation and dreams.",
    play: "Death of a Salesman",
    character: "Willy Loman",
    genre: "Drama",
  },
  {
    icon: Users,
    title: "The Glass Menagerie - Laura",
    prompt: "Help me develop Laura Wingfield from The Glass Menagerie. I want to capture her shyness and fragility.",
    play: "The Glass Menagerie",
    character: "Laura Wingfield",
    genre: "Drama",
  },
  {
    icon: BookOpen,
    title: "Much Ado About Nothing - Beatrice",
    prompt: "Let's work on Beatrice from Much Ado About Nothing. I need help with her wit and banter with Benedick.",
    play: "Much Ado About Nothing",
    character: "Beatrice",
    genre: "Shakespeare",
  },
  {
    icon: Sparkles,
    title: "Who's Afraid of Virginia Woolf - Martha",
    prompt: "I want to rehearse Martha from Who's Afraid of Virginia Woolf. Help me with her aggression and pain.",
    play: "Who's Afraid of Virginia Woolf",
    character: "Martha",
    genre: "Drama",
  },
]

interface UploadedFile {
  name: string
  content: string
  type: string
}

interface ChatInterfaceProps {
  onConversationStart?: () => void
}

export function ChatInterface({ onConversationStart }: ChatInterfaceProps) {
  const [message, setMessage] = useState("")
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [selectedVoice, setSelectedVoice] = useState<SpeechSynthesisVoice>()
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([])
  const [voiceError, setVoiceError] = useState<string>("")
  const [isLoading, setIsLoading] = useState(false)
  const [showFileUpload, setShowFileUpload] = useState(false)
  const [uploadedFile, setUploadedFile] = useState<UploadedFile | null>(null)
  const [isUserScrolling, setIsUserScrolling] = useState(false)
  const [shouldAutoScroll, setShouldAutoScroll] = useState(true)
  const [showScrollButton, setShowScrollButton] = useState(false)
  const [showEmojiReaction, setShowEmojiReaction] = useState(false)
  const [lastMessageContent, setLastMessageContent] = useState("")

  const messagesEndRef = useRef<HTMLDivElement>(null)
  const messagesContainerRef = useRef<HTMLDivElement>(null)
  const scrollTimeoutRef = useRef<NodeJS.Timeout>()
  const lastScrollTopRef = useRef(0)
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const autoScrollTimeoutRef = useRef<NodeJS.Timeout>()

  const { getCurrentConversation, createConversation, addMessage, memory, getPersonalizedGreeting } = useConversations()

  const currentConversation = getCurrentConversation()
  const chatMessages = currentConversation?.messages || []

  const {
    isListening,
    isSupported,
    transcript,
    hasPermission,
    startListening,
    stopListening,
    speak,
    stopSpeaking,
    getVoices,
  } = useVoice({
    onTranscript: (text) => {
      setMessage((prev) => {
        const separator = prev.trim() ? " " : ""
        return prev + separator + text
      })
    },
    onError: (error) => {
      console.error("Voice error:", error)
      setVoiceError(error)
      setTimeout(() => setVoiceError(""), 5000)
    },
  })

  useEffect(() => {
    const loadVoices = () => {
      const availableVoices = getVoices()
      setVoices(availableVoices)

      const defaultVoice =
        availableVoices.find((voice) => voice.lang.startsWith("en") && voice.name.toLowerCase().includes("female")) ||
        availableVoices.find((voice) => voice.lang.startsWith("en"))

      if (defaultVoice) {
        setSelectedVoice(defaultVoice)
      }
    }

    loadVoices()

    if (window.speechSynthesis) {
      window.speechSynthesis.onvoiceschanged = loadVoices
    }
  }, [getVoices])

  // Get personalized suggestions based on memory
  const getPersonalizedSuggestions = useCallback(() => {
    const suggestions = [...scriptSuggestions]

    // If user has memory, prioritize related suggestions
    if (memory.lastPlay || memory.lastCharacter || memory.lastGenre) {
      const prioritized = suggestions.filter(
        (s) =>
          s.play === memory.lastPlay ||
          s.character.includes(memory.lastCharacter || "") ||
          s.genre === memory.lastGenre,
      )

      const others = suggestions.filter(
        (s) =>
          s.play !== memory.lastPlay &&
          !s.character.includes(memory.lastCharacter || "") &&
          s.genre !== memory.lastGenre,
      )

      return [...prioritized.slice(0, 2), ...others.slice(0, 2)]
    }

    // Return random 4 suggestions for new users
    return suggestions.sort(() => Math.random() - 0.5).slice(0, 4)
  }, [memory])

  // Get smart suggestions based on user memory and context
  const getSmartSuggestions = useCallback(() => {
    const suggestions = [
      "Let's rehearse a scene from Hamlet",
      "Practice a contemporary monologue",
      "Work on a comedic scene from Shakespeare",
      "Rehearse an emotional dramatic piece",
      "Practice improvisation exercises",
    ]

    // Personalize based on memory
    if (memory.recentPlays && memory.recentPlays.length > 0) {
      suggestions.unshift(`Continue with ${memory.recentPlays[0]}`)
    }

    if (memory.favoriteGenres && memory.favoriteGenres.includes("comedy")) {
      suggestions.unshift("Practice a comedic scene")
    }

    if (memory.favoriteGenres && memory.favoriteGenres.includes("drama")) {
      suggestions.unshift("Work on dramatic dialogue")
    }

    return suggestions.slice(0, 4)
  }, [memory])

  // Enhanced auto-scroll behavior
  const scrollToBottom = useCallback(
    (force = false) => {
      if (messagesEndRef.current && (shouldAutoScroll || force)) {
        // Clear any existing timeout
        if (autoScrollTimeoutRef.current) {
          clearTimeout(autoScrollTimeoutRef.current)
        }

        // Use multiple strategies for reliable scrolling
        const scrollElement = messagesEndRef.current

        // Strategy 1: Immediate scroll
        scrollElement.scrollIntoView({ behavior: "smooth", block: "end" })

        // Strategy 2: Backup scroll after a short delay
        autoScrollTimeoutRef.current = setTimeout(() => {
          scrollElement.scrollIntoView({ behavior: "smooth", block: "end" })
        }, 100)

        // Strategy 3: Final fallback scroll
        setTimeout(() => {
          if (messagesContainerRef.current) {
            const container = messagesContainerRef.current
            container.scrollTop = container.scrollHeight
          }
        }, 300)
      }
    },
    [shouldAutoScroll],
  )

  // Handle scroll detection with improved logic
  const handleScroll = useCallback(() => {
    const container = messagesContainerRef.current
    if (!container) return

    const { scrollTop, scrollHeight, clientHeight } = container
    const isAtBottom = Math.abs(scrollHeight - clientHeight - scrollTop) < 100
    const isScrollingUp = scrollTop < lastScrollTopRef.current

    // Show scroll button when user scrolls up and there are new messages
    setShowScrollButton(!isAtBottom && chatMessages.length > 0)

    // Update auto-scroll behavior
    if (isScrollingUp && !isAtBottom) {
      setIsUserScrolling(true)
      setShouldAutoScroll(false)
    } else if (isAtBottom) {
      setIsUserScrolling(false)
      setShouldAutoScroll(true)
      setShowScrollButton(false)
    }

    lastScrollTopRef.current = scrollTop

    // Clear existing timeout
    if (scrollTimeoutRef.current) {
      clearTimeout(scrollTimeoutRef.current)
    }

    // Reset auto-scroll after user stops scrolling
    scrollTimeoutRef.current = setTimeout(() => {
      if (isAtBottom) {
        setIsUserScrolling(false)
        setShouldAutoScroll(true)
        setShowScrollButton(false)
      }
    }, 1500)
  }, [chatMessages.length])

  // Auto-scroll when new messages arrive
  useEffect(() => {
    if (chatMessages.length > 0) {
      // Always scroll to bottom for new messages
      setTimeout(() => {
        scrollToBottom(true)
      }, 50)
    }
  }, [chatMessages.length, scrollToBottom])

  // Auto-scroll when loading state changes
  useEffect(() => {
    if (isLoading) {
      setTimeout(() => {
        scrollToBottom(true)
      }, 50)
    }
  }, [isLoading, scrollToBottom])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if ((!message.trim() && !uploadedFile) || isLoading) return

    // Force auto-scroll for new messages
    setShouldAutoScroll(true)
    setIsUserScrolling(false)
    setShowScrollButton(false)

    let userContent = message.trim()

    if (uploadedFile) {
      userContent = uploadedFile.content + (userContent ? `\n\n${userContent}` : "")
    }

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      content: uploadedFile
        ? `📎 ${uploadedFile.name}\n\n${message.trim() || "Please help me rehearse this script."}`
        : userContent,
      isUser: true,
      timestamp: new Date(),
    }

    // Trigger emoji reactions for user messages
    setLastMessageContent(userContent)
    setShowEmojiReaction(true)
    setTimeout(() => setShowEmojiReaction(false), 100)

    // Create new conversation or add to existing
    let conversationId = currentConversation?.id
    if (!conversationId) {
      conversationId = createConversation(userMessage)
      onConversationStart?.()
    } else {
      addMessage(userMessage)
    }

    // Clear message and restore focus
    setMessage("")
    setTimeout(() => {
      textareaRef.current?.focus()
    }, 100)

    setUploadedFile(null)
    setIsLoading(true)

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: userContent,
          memory: memory, // Send memory context to API
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to get AI response")
      }

      const data = await response.json()

      const aiMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        content: data.response,
        isUser: false,
        timestamp: new Date(),
        source: data.source,
      }

      addMessage(aiMessage, conversationId)

      // Trigger emoji reactions for AI responses too
      setTimeout(() => {
        setLastMessageContent(data.response)
        setShowEmojiReaction(true)
        setTimeout(() => setShowEmojiReaction(false), 100)
      }, 500)

      // Speak the AI response
      if (selectedVoice && data.response) {
        setIsSpeaking(true)
        const utterance = speak(data.response, selectedVoice)
        if (utterance) {
          utterance.onend = () => setIsSpeaking(false)
          utterance.onerror = () => setIsSpeaking(false)
        }
      }
    } catch (error) {
      console.error("Chat error:", error)
      const errorMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        content: "I'm having a moment of stage fright! Please try again, and let's create some magic together.",
        isUser: false,
        timestamp: new Date(),
        source: "error",
      }
      addMessage(errorMessage, conversationId)
    } finally {
      setIsLoading(false)
    }
  }

  const handleExampleClick = (prompt: string) => {
    setMessage(prompt)
    setTimeout(() => {
      textareaRef.current?.focus()
    }, 100)
  }

  const toggleListening = () => {
    if (isListening) {
      stopListening()
    } else {
      startListening()
    }
  }

  const toggleSpeaking = () => {
    if (isSpeaking) {
      stopSpeaking()
      setIsSpeaking(false)
    }
  }

  const handleTestVoice = (voice: SpeechSynthesisVoice) => {
    const testText = "Hello! I'm your AI scene partner. Let's create some magic together!"
    speak(testText, voice)
  }

  const handleFileUploaded = (file: UploadedFile) => {
    setUploadedFile(file)
    setShowFileUpload(false)
  }

  const removeUploadedFile = () => {
    setUploadedFile(null)
  }

  const handleScrollToBottom = () => {
    setShouldAutoScroll(true)
    setIsUserScrolling(false)
    setShowScrollButton(false)
    scrollToBottom(true)
  }

  const hasStartedChatting = chatMessages.length > 0 || isLoading
  const personalizedSuggestions = getPersonalizedSuggestions()

  return (
    <motion.div
      className={`w-full mx-auto px-4 transition-all duration-700 ease-in-out ${
        hasStartedChatting ? "max-w-5xl" : "max-w-4xl"
      }`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 1 }}
      data-chat-interface
    >
      {/* Emoji Reactions */}
      <EmojiReactions trigger={showEmojiReaction} messageContent={lastMessageContent} />

      {/* Voice Error Alert */}
      <AnimatePresence>
        {voiceError && (
          <motion.div
            className="mb-6 p-4 bg-red-900/50 backdrop-blur-sm border border-red-500/30 rounded-lg flex items-center space-x-3"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
          >
            <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0" />
            <p className="text-red-300 text-sm">{voiceError}</p>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setVoiceError("")}
              className="ml-auto text-red-400 hover:text-red-300"
            >
              ×
            </Button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Memory Status */}
      {!hasStartedChatting && memory.totalSessions > 0 && (
        <motion.div
          className="mb-6 p-4 bg-purple-900/20 backdrop-blur-sm border border-purple-500/30 rounded-lg"
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          transition={{ delay: 1.5 }}
        >
          <div className="flex items-center space-x-3">
            <Clock className="w-5 h-5 text-purple-400" />
            <div>
              <p className="text-purple-300 font-medium">Welcome back!</p>
              <p className="text-gray-300 text-sm">
                Session #{memory.totalSessions + 1} •
                {memory.lastCharacter && ` Last character: ${memory.lastCharacter}`}
                {memory.lastPlay && ` • ${memory.lastPlay}`}
              </p>
            </div>
          </div>
        </motion.div>
      )}

      {/* Chat Messages */}
      <AnimatePresence>
        {hasStartedChatting && (
          <motion.div
            className="relative"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
          >
            <div
              ref={messagesContainerRef}
              className={`mb-6 space-y-6 px-2 chat-messages transition-all duration-700 ease-in-out ${
                hasStartedChatting ? "max-h-[70vh] min-h-[400px]" : "max-h-[500px]"
              } overflow-y-auto scroll-smooth`}
              onScroll={handleScroll}
            >
              {chatMessages.map((msg, index) => (
                <motion.div
                  key={msg.id}
                  className={`flex ${msg.isUser ? "justify-end" : "justify-start"}`}
                  initial={{ opacity: 0, y: 20, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{
                    delay: index * 0.05,
                    duration: 0.3,
                    ease: "easeOut",
                  }}
                >
                  <div
                    className={`flex items-start space-x-3 max-w-[85%] ${msg.isUser ? "flex-row-reverse space-x-reverse" : ""}`}
                  >
                    <motion.div
                      className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                        msg.isUser ? "bg-gradient-to-r from-pink-500 to-purple-600" : "bg-gray-700"
                      }`}
                      whileHover={{ scale: 1.1 }}
                      transition={{ type: "spring", stiffness: 400, damping: 10 }}
                    >
                      {msg.isUser ? (
                        <span className="text-white text-sm font-medium">U</span>
                      ) : (
                        <Bot className="w-4 h-4 text-pink-400" />
                      )}
                    </motion.div>

                    <motion.div
                      className={`rounded-2xl px-5 py-4 message-bubble ${
                        msg.isUser
                          ? "bg-gradient-to-r from-pink-500 to-purple-600 text-white"
                          : "bg-gray-800/60 backdrop-blur-sm text-gray-100 border border-gray-700/50"
                      }`}
                      whileHover={{ scale: 1.01 }}
                      transition={{ type: "spring", stiffness: 400, damping: 10 }}
                    >
                      {!msg.isUser && (
                        <div className="flex items-center space-x-2 mb-2">
                          <span className="text-xs text-pink-400 font-medium">Cued AI</span>
                          {msg.source === "fallback" && (
                            <Zap
                              className="w-3 h-3 text-yellow-400"
                              title="Powered by Cued's intelligent fallback system"
                            />
                          )}
                        </div>
                      )}
                      <div className="whitespace-pre-wrap">{msg.content}</div>
                    </motion.div>
                  </div>
                </motion.div>
              ))}

              {/* Loading Message */}
              {isLoading && (
                <motion.div
                  className="flex justify-start"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="flex items-start space-x-3 max-w-[85%]">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center">
                      <Bot className="w-4 h-4 text-pink-400" />
                    </div>
                    <div className="bg-gray-800/60 backdrop-blur-sm border border-gray-700/50 rounded-2xl px-5 py-4">
                      <div className="flex items-center space-x-2 mb-2">
                        <span className="text-xs text-pink-400 font-medium">Cued AI</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="flex space-x-1">
                          <motion.div
                            className="w-2 h-2 bg-pink-400 rounded-full"
                            animate={{ scale: [1, 1.2, 1] }}
                            transition={{ duration: 0.6, repeat: Number.POSITIVE_INFINITY, delay: 0 }}
                          />
                          <motion.div
                            className="w-2 h-2 bg-pink-400 rounded-full"
                            animate={{ scale: [1, 1.2, 1] }}
                            transition={{ duration: 0.6, repeat: Number.POSITIVE_INFINITY, delay: 0.2 }}
                          />
                          <motion.div
                            className="w-2 h-2 bg-pink-400 rounded-full"
                            animate={{ scale: [1, 1.2, 1] }}
                            transition={{ duration: 0.6, repeat: Number.POSITIVE_INFINITY, delay: 0.4 }}
                          />
                        </div>
                        <span className="text-gray-400 text-sm">Thinking...</span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Scroll to Bottom Button */}
            <AnimatePresence>
              {showScrollButton && (
                <motion.button
                  onClick={handleScrollToBottom}
                  className="absolute bottom-6 right-6 z-10 bg-pink-600 hover:bg-pink-700 text-white p-3 rounded-full shadow-lg transition-colors group"
                  initial={{ opacity: 0, scale: 0.8, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.8, y: 20 }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  title="Scroll to latest message"
                >
                  <ChevronDown className="w-5 h-5 group-hover:translate-y-0.5 transition-transform" />
                </motion.button>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Voice Status */}
      <AnimatePresence>
        {(isListening || isSpeaking) && (
          <motion.div
            className="mb-6 p-4 bg-gray-900/50 backdrop-blur-sm border border-pink-500/30 rounded-lg"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
          >
            {isListening && (
              <div className="text-center">
                <p className="text-pink-400 font-medium mb-2">🎤 Listening...</p>
                <VoiceVisualizer isActive={isListening} />
                {transcript && <p className="text-gray-300 text-sm mt-2">"{transcript}"</p>}
              </div>
            )}

            {isSpeaking && (
              <div className="text-center">
                <p className="text-purple-400 font-medium mb-2">🎭 AI Speaking...</p>
                <VoiceVisualizer isActive={isSpeaking} color="#a855f7" />
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Welcome Message */}
      {!hasStartedChatting && (
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ delay: 1.2 }}
        >
          <h2 className="text-2xl md:text-3xl font-semibold text-white mb-4">
            {memory.totalSessions > 0 ? "Ready to continue rehearsing?" : "Ready to rehearse?"}
          </h2>
          <p className="text-gray-300 text-lg">{getPersonalizedGreeting()}</p>
          {!isSupported && (
            <p className="text-yellow-400 text-sm mt-2">
              ⚠️ Voice features require a modern browser with microphone access
            </p>
          )}
          {hasPermission === false && (
            <p className="text-red-400 text-sm mt-2">
              🎤 Microphone access denied. Please allow microphone access to use voice features.
            </p>
          )}
        </motion.div>
      )}

      {/* Enhanced Script Suggestions */}
      {!hasStartedChatting && (
        <motion.div
          className="mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ delay: 1.4 }}
        >
          {memory.totalSessions > 0 && (
            <div className="text-center mb-6">
              <p className="text-gray-400 text-sm flex items-center justify-center space-x-2">
                <Heart className="w-4 h-4 text-pink-400" />
                <span>Suggestions based on your rehearsal history</span>
              </p>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {personalizedSuggestions.map((example, index) => (
              <motion.button
                key={example.title}
                onClick={() => handleExampleClick(example.prompt)}
                className="p-4 bg-gray-900/50 backdrop-blur-sm border border-gray-700/50 rounded-lg text-left hover:border-pink-500/50 hover:bg-gray-800/50 transition-all duration-200 group"
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.6 + index * 0.1 }}
              >
                <div className="flex items-start space-x-3">
                  <motion.div
                    className="p-2 bg-gradient-to-br from-pink-500/20 to-purple-600/20 rounded-lg group-hover:from-pink-500/30 group-hover:to-purple-600/30 transition-colors"
                    whileHover={{ rotate: 5 }}
                  >
                    <example.icon className="w-5 h-5 text-pink-400" />
                  </motion.div>
                  <div className="flex-1">
                    <h3 className="text-white font-medium mb-1">{example.title}</h3>
                    <p className="text-gray-400 text-sm leading-relaxed mb-2">{example.prompt}</p>
                    <div className="flex items-center space-x-2 text-xs">
                      <span className="px-2 py-1 bg-purple-500/20 text-purple-300 rounded">{example.genre}</span>
                      <span className="text-gray-500">•</span>
                      <span className="text-gray-500">{example.character}</span>
                    </div>
                  </div>
                </div>
              </motion.button>
            ))}
          </div>
        </motion.div>
      )}

      {/* File Upload Zone */}
      <AnimatePresence>
        {showFileUpload && (
          <motion.div
            className="mb-6"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
          >
            <FileUploadZone onFileUploaded={handleFileUploaded} onClose={() => setShowFileUpload(false)} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Uploaded File Preview */}
      <AnimatePresence>
        {uploadedFile && (
          <motion.div
            className="mb-4 p-3 bg-blue-900/20 border border-blue-500/30 rounded-lg flex items-center justify-between"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
          >
            <div className="flex items-center space-x-3">
              <FileText className="w-5 h-5 text-blue-400" />
              <div>
                <p className="text-blue-300 font-medium">{uploadedFile.name}</p>
                <p className="text-gray-400 text-sm">
                  Ready to rehearse • {uploadedFile.content.split("\n").length} lines
                </p>
              </div>
            </div>
            <Button variant="ghost" size="sm" onClick={removeUploadedFile} className="text-gray-400 hover:text-white">
              <X className="w-4 h-4" />
            </Button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Chat Input */}
      <motion.div
        className={`${hasStartedChatting ? "fixed bottom-0 left-0 right-0 bg-black/80 backdrop-blur-md border-t border-gray-800/50 p-4" : "relative"}`}
        initial={{ opacity: 0, y: 20 }}
        animate={{
          opacity: 1,
          y: 0,
          transition: {
            duration: hasStartedChatting ? 0.5 : 0.8,
            delay: hasStartedChatting ? 0 : 1.8,
          },
        }}
      >
        <form onSubmit={handleSubmit} className={`${hasStartedChatting ? "max-w-5xl mx-auto" : ""}`}>
          <div className="relative bg-gray-900/50 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-4 focus-within:border-pink-500/50 transition-colors">
            <Textarea
              ref={textareaRef}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder={
                uploadedFile
                  ? "Add any notes or questions about your script..."
                  : memory.lastCharacter
                    ? `Continue with ${memory.lastCharacter} or try something new...`
                    : "Start your scene... 'Let's rehearse the balcony scene from Romeo and Juliet'"
              }
              className="w-full bg-transparent border-none resize-none text-white placeholder-gray-400 focus:ring-0 focus:outline-none min-h-[60px] max-h-[200px]"
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault()
                  handleSubmit(e)
                }
              }}
            />

            <div className="flex items-center justify-between mt-3">
              <div className="flex items-center space-x-2">
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowFileUpload(!showFileUpload)}
                  className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-gray-800/50 transition-colors"
                >
                  <Paperclip className="w-4 h-4" />
                </Button>

                {isSupported && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={toggleListening}
                    disabled={hasPermission === false}
                    className={`p-2 rounded-lg transition-colors ${
                      isListening
                        ? "bg-pink-500/20 text-pink-400"
                        : "text-gray-400 hover:text-white hover:bg-gray-800/50"
                    } ${hasPermission === false ? "opacity-50 cursor-not-allowed" : ""}`}
                  >
                    {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                  </Button>
                )}

                {isSpeaking && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={toggleSpeaking}
                    className="p-2 rounded-lg text-purple-400 bg-purple-500/20 hover:bg-purple-500/30 transition-colors"
                  >
                    <VolumeX className="w-4 h-4" />
                  </Button>
                )}

                <VoiceSettings
                  voices={voices}
                  selectedVoice={selectedVoice}
                  onVoiceChange={setSelectedVoice}
                  onTestVoice={handleTestVoice}
                />

                <span className="text-xs text-gray-500">
                  {isListening
                    ? "Listening..."
                    : isSpeaking
                      ? "AI Speaking..."
                      : hasPermission === false
                        ? "Mic access needed"
                        : "Press to speak"}
                </span>
              </div>

              <Button
                type="submit"
                disabled={(!message.trim() && !uploadedFile) || isListening || isLoading}
                className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white font-medium px-6 py-2 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 group"
              >
                <Send className="w-4 h-4 mr-2 group-hover:translate-x-0.5 transition-transform" />
                {isLoading ? "Thinking..." : uploadedFile ? "Rehearse Script" : "Start Scene"}
              </Button>
            </div>
          </div>

          {!hasStartedChatting && (
            <p className="text-xs text-gray-500 text-center mt-3">
              Press Enter to send, Shift + Enter for new line • 📎 Upload scripts • 🎤 Click mic to speak • AI responds
              with voice
            </p>
          )}
        </form>
      </motion.div>

      {hasStartedChatting && <div className="h-32" />}
    </motion.div>
  )
}
