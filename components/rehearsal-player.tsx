"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  SkipForward,
  SkipBack,
  RotateCcw,
  Brain,
  Users,
  User,
  Volume2,
  Eye,
  EyeOff,
  MessageSquare,
  CheckCircle,
} from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { useVoice } from "@/hooks/use-voice"

interface ParsedLine {
  id: string
  speaker: string
  text: string
  lineNumber: number
  isUserLine: boolean
}

interface RehearsalSession {
  id: string
  title: string
  script: ParsedLine[]
  currentLine: number
  mode: "self" | "partner" | "prompt"
  progress: number
  createdAt: Date
  updatedAt: Date
}

interface RehearsalPlayerProps {
  script: ParsedLine[]
  session: RehearsalSession
  onSessionUpdate: (session: RehearsalSession) => void
}

export function RehearsalPlayer({ script, session, onSessionUpdate }: RehearsalPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false)
  const [selectedCharacter, setSelectedCharacter] = useState<string>("")
  const [showHiddenLines, setShowHiddenLines] = useState(false)
  const [feedback, setFeedback] = useState<string>("")
  const [isGettingFeedback, setIsGettingFeedback] = useState(false)

  const { speak, isSupported } = useVoice()

  // Get unique speakers from script
  const speakers = Array.from(new Set(script.map((line) => line.speaker)))

  // Update script with user's character selection
  useEffect(() => {
    if (selectedCharacter) {
      const updatedScript = script.map((line) => ({
        ...line,
        isUserLine: line.speaker === selectedCharacter,
      }))

      onSessionUpdate({
        ...session,
        script: updatedScript,
      })
    }
  }, [selectedCharacter, script, session, onSessionUpdate])

  const currentLine = script[session.currentLine]
  const isUserTurn = currentLine?.isUserLine
  const shouldHideLine = session.mode === "prompt" && isUserTurn && !showHiddenLines

  const nextLine = () => {
    if (session.currentLine < script.length - 1) {
      const newCurrentLine = session.currentLine + 1
      const progress = ((newCurrentLine + 1) / script.length) * 100

      onSessionUpdate({
        ...session,
        currentLine: newCurrentLine,
        progress,
        updatedAt: new Date(),
      })
    }
  }

  const previousLine = () => {
    if (session.currentLine > 0) {
      const newCurrentLine = session.currentLine - 1
      const progress = ((newCurrentLine + 1) / script.length) * 100

      onSessionUpdate({
        ...session,
        currentLine: newCurrentLine,
        progress,
        updatedAt: new Date(),
      })
    }
  }

  const repeatLine = () => {
    if (currentLine && !isUserTurn && isSupported) {
      speak(currentLine.text)
    }
  }

  const toggleMode = (mode: "self" | "partner" | "prompt") => {
    onSessionUpdate({
      ...session,
      mode,
      updatedAt: new Date(),
    })
  }

  const getFeedback = async () => {
    if (!currentLine) return

    setIsGettingFeedback(true)
    setFeedback("")

    try {
      const response = await fetch("/api/rehearsal-feedback", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          line: currentLine,
          context: script.slice(Math.max(0, session.currentLine - 2), session.currentLine + 3),
          mode: session.mode,
        }),
      })

      if (response.ok) {
        const { feedback: aiFeedback } = await response.json()
        setFeedback(aiFeedback)
      } else {
        setFeedback("I'm having trouble providing feedback right now. Keep practicing - you're doing great!")
      }
    } catch (error) {
      setFeedback("I'm having trouble providing feedback right now. Keep practicing - you're doing great!")
    } finally {
      setIsGettingFeedback(false)
    }
  }

  const resetToBeginning = () => {
    onSessionUpdate({
      ...session,
      currentLine: 0,
      progress: 0,
      updatedAt: new Date(),
    })
  }

  // Auto-speak AI lines when not in prompt mode
  useEffect(() => {
    if (currentLine && !isUserTurn && session.mode !== "prompt" && isSupported) {
      const timer = setTimeout(() => {
        speak(currentLine.text)
      }, 500)

      return () => clearTimeout(timer)
    }
  }, [currentLine, isUserTurn, session.mode, speak, isSupported])

  if (!selectedCharacter) {
    return (
      <Card className="bg-gray-900/50 border-gray-700">
        <CardContent className="p-8 text-center">
          <h3 className="text-xl font-semibold text-white mb-4">Choose Your Character</h3>
          <p className="text-gray-400 mb-6">Select which character you'll be playing:</p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-w-2xl mx-auto">
            {speakers.map((speaker) => (
              <motion.button
                key={speaker}
                onClick={() => setSelectedCharacter(speaker)}
                className="p-4 bg-gray-800/50 hover:bg-gray-800/70 rounded-lg border border-gray-700 hover:border-pink-500/50 transition-all group"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="flex items-center justify-center space-x-2">
                  <User className="w-5 h-5 text-pink-400" />
                  <span className="text-white font-medium">{speaker}</span>
                </div>
                <p className="text-gray-400 text-sm mt-2">
                  {script.filter((line) => line.speaker === speaker).length} lines
                </p>
              </motion.button>
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {/* Mode Selection */}
      <Card className="bg-gray-900/50 border-gray-700">
        <CardContent className="p-4">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center space-x-2">
              <span className="text-gray-300 text-sm">Practice Mode:</span>
              <div className="flex space-x-2">
                <Button
                  variant={session.mode === "self" ? "default" : "outline"}
                  size="sm"
                  onClick={() => toggleMode("self")}
                  className="flex items-center space-x-1"
                >
                  <User className="w-4 h-4" />
                  <span>As Myself</span>
                </Button>
                <Button
                  variant={session.mode === "partner" ? "default" : "outline"}
                  size="sm"
                  onClick={() => toggleMode("partner")}
                  className="flex items-center space-x-1"
                >
                  <Users className="w-4 h-4" />
                  <span>As Partner</span>
                </Button>
                <Button
                  variant={session.mode === "prompt" ? "default" : "outline"}
                  size="sm"
                  onClick={() => toggleMode("prompt")}
                  className="flex items-center space-x-1"
                >
                  <Brain className="w-4 h-4" />
                  <span>Prompt Me</span>
                </Button>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Badge variant="secondary" className="bg-purple-900/50 text-purple-300">
                Playing: {selectedCharacter}
              </Badge>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSelectedCharacter("")}
                className="text-gray-400 hover:text-white"
              >
                Change
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Current Line Display */}
      <Card className="bg-gray-900/50 border-gray-700">
        <CardContent className="p-6">
          <AnimatePresence mode="wait">
            {currentLine && (
              <motion.div
                key={currentLine.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-4"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Badge
                      variant={isUserTurn ? "default" : "secondary"}
                      className={isUserTurn ? "bg-pink-600" : "bg-gray-600"}
                    >
                      {currentLine.speaker}
                    </Badge>
                    <span className="text-gray-400 text-sm">
                      Line {session.currentLine + 1} of {script.length}
                    </span>
                  </div>

                  {session.mode === "prompt" && isUserTurn && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setShowHiddenLines(!showHiddenLines)}
                      className="text-gray-400 hover:text-white"
                    >
                      {showHiddenLines ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      {showHiddenLines ? "Hide" : "Reveal"}
                    </Button>
                  )}
                </div>

                <div className="bg-gray-800/50 rounded-lg p-6">
                  {shouldHideLine ? (
                    <div className="text-center py-8">
                      <Brain className="w-12 h-12 text-pink-400 mx-auto mb-4" />
                      <p className="text-gray-400 text-lg">Your line - try to remember!</p>
                      <p className="text-gray-500 text-sm mt-2">Click "Reveal" if you need help</p>
                    </div>
                  ) : (
                    <p className="text-white text-lg leading-relaxed">{currentLine.text}</p>
                  )}
                </div>

                {isUserTurn && (
                  <div className="flex items-center justify-center space-x-2 text-pink-400">
                    <User className="w-5 h-5" />
                    <span className="font-medium">Your turn to speak</span>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </CardContent>
      </Card>

      {/* Controls */}
      <Card className="bg-gray-900/50 border-gray-700">
        <CardContent className="p-4">
          <div className="flex flex-wrap items-center justify-center gap-3">
            <Button
              variant="outline"
              onClick={resetToBeginning}
              disabled={session.currentLine === 0}
              className="flex items-center space-x-2"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Reset</span>
            </Button>

            <Button
              variant="outline"
              onClick={previousLine}
              disabled={session.currentLine === 0}
              className="flex items-center space-x-2"
            >
              <SkipBack className="w-4 h-4" />
              <span>Previous</span>
            </Button>

            <Button
              variant="outline"
              onClick={repeatLine}
              disabled={isUserTurn || !isSupported}
              className="flex items-center space-x-2"
            >
              <Volume2 className="w-4 h-4" />
              <span>Repeat</span>
            </Button>

            <Button
              onClick={nextLine}
              disabled={session.currentLine >= script.length - 1}
              className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 flex items-center space-x-2"
            >
              <span>Next Line</span>
              <SkipForward className="w-4 h-4" />
            </Button>

            <Button
              variant="outline"
              onClick={getFeedback}
              disabled={isGettingFeedback}
              className="flex items-center space-x-2"
            >
              <MessageSquare className="w-4 h-4" />
              <span>{isGettingFeedback ? "Getting..." : "Feedback"}</span>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Feedback */}
      <AnimatePresence>
        {feedback && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
          >
            <Card className="bg-blue-900/20 border-blue-500/30">
              <CardContent className="p-4">
                <div className="flex items-start space-x-3">
                  <MessageSquare className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-blue-300 font-medium mb-2">AI Feedback</h4>
                    <p className="text-gray-300 leading-relaxed">{feedback}</p>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setFeedback("")}
                    className="text-gray-400 hover:text-white"
                  >
                    ×
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Completion */}
      {session.currentLine >= script.length - 1 && (
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}>
          <Card className="bg-green-900/20 border-green-500/30">
            <CardContent className="p-6 text-center">
              <CheckCircle className="w-12 h-12 text-green-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-green-300 mb-2">Scene Complete!</h3>
              <p className="text-gray-300 mb-4">Great work! You've completed the entire script.</p>
              <Button
                onClick={resetToBeginning}
                className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700"
              >
                <RotateCcw className="w-4 h-4 mr-2" />
                Practice Again
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </div>
  )
}
