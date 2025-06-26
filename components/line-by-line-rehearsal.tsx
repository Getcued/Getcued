"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Upload, FileText, Play, Save } from "lucide-react"
import { ScriptUploader } from "./script-uploader"
import { RehearsalPlayer } from "./rehearsal-player"
import { ProgressTracker } from "./progress-tracker"

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

export function LineByLineRehearsal() {
  const [activeTab, setActiveTab] = useState<"upload" | "rehearse">("upload")
  const [rawScript, setRawScript] = useState("")
  const [parsedScript, setParsedScript] = useState<ParsedLine[]>([])
  const [currentSession, setCurrentSession] = useState<RehearsalSession | null>(null)
  const [savedSessions, setSavedSessions] = useState<RehearsalSession[]>([])

  // Load saved sessions from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("cued-rehearsal-sessions")
    if (saved) {
      try {
        const sessions = JSON.parse(saved)
        setSavedSessions(sessions)
      } catch (error) {
        console.error("Failed to load saved sessions:", error)
      }
    }
  }, [])

  const handleScriptParsed = (script: ParsedLine[]) => {
    setParsedScript(script)
    setActiveTab("rehearse")

    // Create new session
    const newSession: RehearsalSession = {
      id: Date.now().toString(),
      title: `Rehearsal ${new Date().toLocaleDateString()}`,
      script,
      currentLine: 0,
      mode: "self",
      progress: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    setCurrentSession(newSession)
  }

  const saveSession = () => {
    if (!currentSession) return

    const updatedSession = {
      ...currentSession,
      updatedAt: new Date(),
    }

    const existingIndex = savedSessions.findIndex((s) => s.id === currentSession.id)
    let newSessions

    if (existingIndex >= 0) {
      newSessions = [...savedSessions]
      newSessions[existingIndex] = updatedSession
    } else {
      newSessions = [...savedSessions, updatedSession]
    }

    setSavedSessions(newSessions)
    setCurrentSession(updatedSession)
    localStorage.setItem("cued-rehearsal-sessions", JSON.stringify(newSessions))
  }

  const loadSession = (session: RehearsalSession) => {
    setCurrentSession(session)
    setParsedScript(session.script)
    setActiveTab("rehearse")
  }

  return (
    <div className="space-y-6">
      <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as "upload" | "rehearse")}>
        <TabsList className="grid w-full grid-cols-2 bg-gray-900/50">
          <TabsTrigger value="upload" className="flex items-center space-x-2">
            <Upload className="w-4 h-4" />
            <span>Upload Script</span>
          </TabsTrigger>
          <TabsTrigger value="rehearse" className="flex items-center space-x-2" disabled={parsedScript.length === 0}>
            <Play className="w-4 h-4" />
            <span>Rehearse</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="upload" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Script Input */}
            <Card className="bg-gray-900/50 border-gray-700">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 text-white">
                  <FileText className="w-5 h-5 text-pink-400" />
                  <span>Paste Your Script</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ScriptUploader onScriptParsed={handleScriptParsed} />
              </CardContent>
            </Card>

            {/* Saved Sessions */}
            <Card className="bg-gray-900/50 border-gray-700">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 text-white">
                  <Save className="w-5 h-5 text-purple-400" />
                  <span>Saved Sessions</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {savedSessions.length === 0 ? (
                  <p className="text-gray-400 text-center py-8">No saved sessions yet</p>
                ) : (
                  <div className="space-y-3 max-h-64 overflow-y-auto">
                    {savedSessions.map((session) => (
                      <motion.button
                        key={session.id}
                        onClick={() => loadSession(session)}
                        className="w-full p-3 bg-gray-800/50 hover:bg-gray-800/70 rounded-lg text-left transition-colors group"
                        whileHover={{ scale: 1.02 }}
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="text-white font-medium">{session.title}</h4>
                            <p className="text-gray-400 text-sm">
                              {session.script.length} lines • {Math.round(session.progress)}% complete
                            </p>
                            <p className="text-gray-500 text-xs">{session.updatedAt.toLocaleDateString()}</p>
                          </div>
                          <div className="w-12 h-12 bg-gradient-to-br from-pink-500/20 to-purple-600/20 rounded-full flex items-center justify-center group-hover:from-pink-500/30 group-hover:to-purple-600/30 transition-colors">
                            <Play className="w-5 h-5 text-pink-400" />
                          </div>
                        </div>
                      </motion.button>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="rehearse" className="space-y-6">
          {currentSession && (
            <>
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-white">{currentSession.title}</h2>
                  <p className="text-gray-400">{parsedScript.length} lines total</p>
                </div>
                <Button onClick={saveSession} className="bg-purple-600 hover:bg-purple-700">
                  <Save className="w-4 h-4 mr-2" />
                  Save Session
                </Button>
              </div>

              <ProgressTracker
                currentLine={currentSession.currentLine}
                totalLines={parsedScript.length}
                progress={currentSession.progress}
              />

              <RehearsalPlayer script={parsedScript} session={currentSession} onSessionUpdate={setCurrentSession} />
            </>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
