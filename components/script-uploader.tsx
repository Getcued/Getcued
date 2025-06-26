"use client"

import type React from "react"

import { useState, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Upload, FileText, AlertCircle, CheckCircle } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

interface ParsedLine {
  id: string
  speaker: string
  text: string
  lineNumber: number
  isUserLine: boolean
}

interface ScriptUploaderProps {
  onScriptParsed: (script: ParsedLine[]) => void
}

export function ScriptUploader({ onScriptParsed }: ScriptUploaderProps) {
  const [scriptText, setScriptText] = useState("")
  const [isUploading, setIsUploading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  const parseScript = useCallback((text: string): ParsedLine[] => {
    const lines = text.split("\n").filter((line) => line.trim())
    const parsed: ParsedLine[] = []
    let lineNumber = 1

    for (const line of lines) {
      const trimmedLine = line.trim()
      if (!trimmedLine) continue

      // Detect speaker patterns (SPEAKER:, Speaker:, SPEAKER., etc.)
      const speakerMatch =
        trimmedLine.match(/^([A-Z][A-Z\s]+)[:.](.+)$/) ||
        trimmedLine.match(/^([A-Z][a-z\s]+)[:.](.+)$/) ||
        trimmedLine.match(/^(\w+)[:.](.+)$/)

      if (speakerMatch) {
        const speaker = speakerMatch[1].trim()
        const text = speakerMatch[2].trim()

        parsed.push({
          id: `line-${lineNumber}`,
          speaker,
          text,
          lineNumber,
          isUserLine: false, // Will be determined by user selection
        })
      } else {
        // Handle lines without speaker tags (stage directions, lyrics, etc.)
        parsed.push({
          id: `line-${lineNumber}`,
          speaker: "NARRATOR",
          text: trimmedLine,
          lineNumber,
          isUserLine: false,
        })
      }

      lineNumber++
    }

    return parsed
  }, [])

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    setIsUploading(true)
    setError("")
    setSuccess("")

    try {
      if (file.type === "text/plain") {
        // Handle .txt files
        const text = await file.text()
        const parsed = parseScript(text)
        onScriptParsed(parsed)
        setSuccess(`Successfully parsed ${parsed.length} lines from ${file.name}`)
      } else if (
        file.type === "application/pdf" ||
        file.type === "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
      ) {
        // Handle PDF and DOCX files using OpenAI
        const formData = new FormData()
        formData.append("file", file)

        const response = await fetch("/api/parse-document", {
          method: "POST",
          body: formData,
        })

        if (!response.ok) {
          throw new Error("Failed to parse document")
        }

        const { text } = await response.json()
        const parsed = parseScript(text)
        onScriptParsed(parsed)
        setSuccess(`Successfully parsed ${parsed.length} lines from ${file.name}`)
      } else {
        throw new Error("Unsupported file type. Please use .txt, .pdf, or .docx files.")
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to upload file")
    } finally {
      setIsUploading(false)
    }
  }

  const handleTextSubmit = () => {
    if (!scriptText.trim()) {
      setError("Please enter some script text")
      return
    }

    setError("")
    const parsed = parseScript(scriptText)

    if (parsed.length === 0) {
      setError("No lines could be parsed from the text. Please check the format.")
      return
    }

    onScriptParsed(parsed)
    setSuccess(`Successfully parsed ${parsed.length} lines`)
  }

  return (
    <div className="space-y-6">
      {/* File Upload */}
      <div className="space-y-4">
        <div className="border-2 border-dashed border-gray-600 rounded-lg p-6 text-center hover:border-pink-500/50 transition-colors">
          <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
          <p className="text-gray-300 mb-2">Upload a script file</p>
          <p className="text-gray-500 text-sm mb-4">Supports .txt, .pdf, and .docx files</p>
          <Input
            type="file"
            accept=".txt,.pdf,.docx"
            onChange={handleFileUpload}
            disabled={isUploading}
            className="hidden"
            id="file-upload"
          />
          <label htmlFor="file-upload">
            <Button variant="outline" className="cursor-pointer" disabled={isUploading} asChild>
              <span>{isUploading ? "Processing..." : "Choose File"}</span>
            </Button>
          </label>
        </div>

        <div className="text-center text-gray-400">
          <span>or</span>
        </div>

        {/* Text Input */}
        <div className="space-y-4">
          <Textarea
            value={scriptText}
            onChange={(e) => setScriptText(e.target.value)}
            placeholder={`Paste your script here...

Example format:
ROMEO: But soft, what light through yonder window breaks?
JULIET: Romeo, Romeo, wherefore art thou Romeo?

Or for songs/lyrics:
[Verse 1]
Line one of the song
Line two of the song

[Chorus]
Chorus line one
Chorus line two`}
            className="min-h-[300px] bg-gray-800/50 border-gray-600 text-white placeholder-gray-400 resize-none"
          />

          <Button
            onClick={handleTextSubmit}
            disabled={!scriptText.trim() || isUploading}
            className="w-full bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700"
          >
            <FileText className="w-4 h-4 mr-2" />
            Parse Script
          </Button>
        </div>
      </div>

      {/* Status Messages */}
      <AnimatePresence>
        {error && (
          <motion.div
            className="p-4 bg-red-900/50 border border-red-500/30 rounded-lg flex items-center space-x-3"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
          >
            <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0" />
            <p className="text-red-300 text-sm">{error}</p>
          </motion.div>
        )}

        {success && (
          <motion.div
            className="p-4 bg-green-900/50 border border-green-500/30 rounded-lg flex items-center space-x-3"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
          >
            <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0" />
            <p className="text-green-300 text-sm">{success}</p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Format Tips */}
      <div className="bg-gray-800/30 rounded-lg p-4">
        <h4 className="text-white font-medium mb-2">📝 Formatting Tips</h4>
        <ul className="text-gray-400 text-sm space-y-1">
          <li>• Use "SPEAKER:" or "Speaker:" format for dialogue</li>
          <li>• Each line should be on a separate line</li>
          <li>• Stage directions can be included without speaker tags</li>
          <li>• For songs, use [Verse], [Chorus] etc. as section markers</li>
        </ul>
      </div>
    </div>
  )
}
