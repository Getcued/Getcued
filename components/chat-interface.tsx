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
} from "lucide-react"
import { useVoice } from "@/hooks/use-voice"
import { VoiceVisualizer } from "@/components/voice-visualizer"
import { VoiceSettings } from "@/components/voice-settings"
import { FileUploadZone } from "@/components/file-upload-zone"
import { useConversations, type ChatMessage } from "@/hooks/use-conversations"

const examplePrompts = [
  {
    icon: Theater,
    title: "Practice a scene",
    prompt: "Let's rehearse Act 2, Scene 1 from Romeo and Juliet. You be Romeo.",
  },
  {
    icon: Users,
    title: "Character work",
    prompt: "Help me develop the backstory for Lady Macbeth in our upcoming production.",
  },
  {
    icon: BookOpen,
    title: "Script analysis",
    prompt: "Can you help me understand Hamlet's motivation in the 'To be or not to be' soliloquy?",
  },
  {
    icon: Sparkles,
    title: "Improv practice",
    prompt: "Let's do an improv scene. You're a detective, I'm a witness to a crime.",
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

  const messagesEndRef = useRef<HTMLDivElement>(null)
  const messagesContainerRef = useRef<HTMLDivElement>(null)
  const scrollTimeoutRef = useRef<NodeJS.Timeout>()
  const lastScrollTopRef = useRef(0)

  const { getCurrentConversation, createConversation, addMessage } = useConversations()

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

  // Smart auto-scroll behavior
  const scrollToBottom = useCallback(
    (smooth = true) => {
      if (messagesEndRef.current && shouldAutoScroll) {
        const scrollOptions: ScrollIntoViewOptions = {
          behavior: smooth ? "smooth" : "auto",
          block: "end",
          inline: "nearest",
        }

        setTimeout(() => {
          messagesEndRef.current?.scrollIntoView(scrollOptions)
        }, 100)
      }
    },
    [shouldAutoScroll],
  )

  // Handle scroll detection
  const handleScroll = useCallback(() => {
    const container = messagesContainerRef.current
    if (!container) return

    const { scrollTop, scrollHeight, clientHeight } = container
    const isAtBottom = Math.abs(scrollHeight - clientHeight - scrollTop) < 50

    if (scrollTop < lastScrollTopRef.current && !isAtBottom) {
      setIsUserScrolling(true)
      setShouldAutoScroll(false)
    } else if (isAtBottom) {
      setIsUserScrolling(false)
      setShouldAutoScroll(true)
    }

    lastScrollTopRef.current = scrollTop

    if (scrollTimeoutRef.current) {
      clearTimeout(scrollTimeoutRef.current)
    }

    scrollTimeoutRef.current = setTimeout(() => {
      if (isAtBottom) {
        setIsUserScrolling(false)
        setShouldAutoScroll(true)
      }
    }, 1000)
  }, [])

  // Auto-scroll when new messages arrive
  useEffect(() => {
    if (chatMessages.length > 0 && shouldAutoScroll) {
      scrollToBottom(true)
    }
  }, [chatMessages, scrollToBottom, shouldAutoScroll])

  useEffect(() => {
    if (isLoading && shouldAutoScroll) {
      scrollToBottom(true)
    }
  }, [isLoading, scrollToBottom, shouldAutoScroll])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if ((!message.trim() && !uploadedFile) || isLoading) return

    setShouldAutoScroll(true)
    setIsUserScrolling(false)

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

    // Create new conversation or add to existing
    let conversationId = currentConversation?.id
    if (!conversationId) {
      conversationId = createConversation(userMessage)
      onConversationStart?.()
    } else {
      addMessage(userMessage)
    }

    setMessage("")
    setUploadedFile(null)
    setIsLoading(true)

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message: userContent }),
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

  const hasStartedChatting = chatMessages.length > 0 || isLoading

  return (
    <motion.div
      className={`w-full mx-auto px-4 transition-all duration-700 ease-in-out ${
        hasStartedChatting ? "max-w-5xl" : "max-w-4xl"
      }`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 1 }}
    >
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

      {/* Chat Messages */}
      <AnimatePresence>
        {hasStartedChatting && (
          <motion.div
            ref={messagesContainerRef}
            className={`mb-6 space-y-6 px-2 chat-messages transition-all duration-700 ease-in-out ${
              hasStartedChatting ? "max-h-[70vh] min-h-[400px]" : "max-h-[500px]"
            } overflow-y-auto`}
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            onScroll={handleScroll}
            style={{ scrollBehavior: "smooth" }}
          >
            {/* Scroll to bottom indicator */}
            <AnimatePresence>
              {isUserScrolling && !shouldAutoScroll && (
                <motion.button
                  onClick={() => {
                    setShouldAutoScroll(true)
                    setIsUserScrolling(false)
                    scrollToBottom(true)
                  }}
                  className="fixed bottom-32 right-8 z-10 bg-pink-600 hover:bg-pink-700 text-white p-3 rounded-full shadow-lg transition-colors"
                  initial={{ opacity: 0, scale: 0.8, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.8, y: 20 }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                  </svg>
                </motion.button>
              )}
            </AnimatePresence>

            {chatMessages.map((msg, index) => (
              <motion.div
                key={msg.id}
                className={`flex ${msg.isUser ? "justify-end" : "justify-start"}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <div
                  className={`flex items-start space-x-3 max-w-[85%] ${msg.isUser ? "flex-row-reverse space-x-reverse" : ""}`}
                >
                  <div
                    className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                      msg.isUser ? "bg-gradient-to-r from-pink-500 to-purple-600" : "bg-gray-700"
                    }`}
                  >
                    {msg.isUser ? (
                      <span className="text-white text-sm font-medium">U</span>
                    ) : (
                      <Bot className="w-4 h-4 text-pink-400" />
                    )}
                  </div>

                  <div
                    className={`rounded-2xl px-5 py-4 message-bubble ${
                      msg.isUser
                        ? "bg-gradient-to-r from-pink-500 to-purple-600 text-white"
                        : "bg-gray-800/60 backdrop-blur-sm text-gray-100 border border-gray-700/50"
                    }`}
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
                  </div>
                </div>
              </motion.div>
            ))}

            {/* Loading Message */}
            {isLoading && (
              <motion.div className="flex justify-start" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
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
                        <div className="w-2 h-2 bg-pink-400 rounded-full animate-bounce" />
                        <div
                          className="w-2 h-2 bg-pink-400 rounded-full animate-bounce"
                          style={{ animationDelay: "0.1s" }}
                        />
                        <div
                          className="w-2 h-2 bg-pink-400 rounded-full animate-bounce"
                          style={{ animationDelay: "0.2s" }}
                        />
                      </div>
                      <span className="text-gray-400 text-sm">Thinking...</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
            <div ref={messagesEndRef} />
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
          <h2 className="text-2xl md:text-3xl font-semibold text-white mb-4">Ready to rehearse?</h2>
          <p className="text-gray-300 text-lg">Start a scene, practice lines, or work on character development</p>
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

      {/* Example Prompts */}
      {!hasStartedChatting && (
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ delay: 1.4 }}
        >
          {examplePrompts.map((example, index) => (
            <motion.button
              key={example.title}
              onClick={() => handleExampleClick(example.prompt)}
              className="p-4 bg-gray-900/50 backdrop-blur-sm border border-gray-700/50 rounded-lg text-left hover:border-pink-500/50 hover:bg-gray-800/50 transition-all duration-200 group"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.6 + index * 0.1 }}
            >
              <div className="flex items-start space-x-3">
                <div className="p-2 bg-gradient-to-br from-pink-500/20 to-purple-600/20 rounded-lg group-hover:from-pink-500/30 group-hover:to-purple-600/30 transition-colors">
                  <example.icon className="w-5 h-5 text-pink-400" />
                </div>
                <div>
                  <h3 className="text-white font-medium mb-1">{example.title}</h3>
                  <p className="text-gray-400 text-sm leading-relaxed">{example.prompt}</p>
                </div>
              </div>
            </motion.button>
          ))}
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
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder={
                uploadedFile
                  ? "Add any notes or questions about your script..."
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
