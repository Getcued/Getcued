"use client"

import type React from "react"

import { useState, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Upload, FileText, AlertCircle, X } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

interface UploadedFile {
  name: string
  content: string
  type: string
}

interface FileUploadZoneProps {
  onFileUploaded: (file: UploadedFile) => void
  onClose: () => void
}

export function FileUploadZone({ onFileUploaded, onClose }: FileUploadZoneProps) {
  const [isDragOver, setIsDragOver] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [error, setError] = useState("")

  const processFile = useCallback(
    async (file: File) => {
      setIsUploading(true)
      setError("")

      try {
        if (file.size > 10 * 1024 * 1024) {
          throw new Error("File too large. Maximum size is 10MB.")
        }

        let content = ""

        if (file.type === "text/plain") {
          content = await file.text()
        } else if (
          file.type === "application/pdf" ||
          file.type === "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
        ) {
          // For now, show a helpful message about these file types
          throw new Error(
            "PDF and DOCX files require additional processing. Please convert to .txt format or copy-paste the text directly.",
          )
        } else {
          throw new Error("Unsupported file type. Please use .txt files.")
        }

        if (!content.trim()) {
          throw new Error("File appears to be empty.")
        }

        onFileUploaded({
          name: file.name,
          content: content.trim(),
          type: file.type,
        })
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to process file")
      } finally {
        setIsUploading(false)
      }
    },
    [onFileUploaded],
  )

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      processFile(file)
    }
  }

  const handleDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault()
      setIsDragOver(false)

      const file = event.dataTransfer.files[0]
      if (file) {
        processFile(file)
      }
    },
    [processFile],
  )

  const handleDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault()
    setIsDragOver(true)
  }, [])

  const handleDragLeave = useCallback((event: React.DragEvent) => {
    event.preventDefault()
    setIsDragOver(false)
  }, [])

  return (
    <motion.div
      className="bg-gray-900/50 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-6"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-white font-semibold flex items-center">
          <Upload className="w-5 h-5 mr-2 text-pink-400" />
          Upload Script
        </h3>
        <Button variant="ghost" size="sm" onClick={onClose} className="text-gray-400 hover:text-white">
          <X className="w-4 h-4" />
        </Button>
      </div>

      {/* Drag & Drop Zone */}
      <div
        className={`border-2 border-dashed rounded-xl p-8 text-center transition-all duration-200 ${
          isDragOver
            ? "border-pink-500 bg-pink-500/10"
            : "border-gray-600 hover:border-pink-500/50 hover:bg-gray-800/30"
        }`}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
      >
        <div className="space-y-4">
          <div className="mx-auto w-16 h-16 bg-gradient-to-br from-pink-500/20 to-purple-600/20 rounded-full flex items-center justify-center">
            <Upload className="w-8 h-8 text-pink-400" />
          </div>

          <div>
            <p className="text-white font-medium mb-2">
              {isDragOver ? "Drop your script here" : "Drag & drop your script"}
            </p>
            <p className="text-gray-400 text-sm mb-4">Supports .txt files • Max 10MB</p>
          </div>

          <div className="space-y-3">
            <Input
              type="file"
              accept=".txt"
              onChange={handleFileSelect}
              disabled={isUploading}
              className="hidden"
              id="script-upload"
            />
            <label htmlFor="script-upload">
              <Button
                variant="outline"
                className="cursor-pointer border-pink-500/50 text-pink-400 hover:bg-pink-500/10"
                disabled={isUploading}
                asChild
              >
                <span>
                  {isUploading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-pink-400/30 border-t-pink-400 rounded-full animate-spin mr-2" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <FileText className="w-4 h-4 mr-2" />
                      Choose File
                    </>
                  )}
                </span>
              </Button>
            </label>

            <p className="text-gray-500 text-xs">or drag and drop</p>
          </div>
        </div>
      </div>

      {/* Error Message */}
      <AnimatePresence>
        {error && (
          <motion.div
            className="mt-4 p-3 bg-red-900/50 border border-red-500/30 rounded-lg flex items-center space-x-3"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
          >
            <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0" />
            <p className="text-red-300 text-sm">{error}</p>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setError("")}
              className="ml-auto text-red-400 hover:text-red-300"
            >
              ×
            </Button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Format Tips */}
      <div className="mt-6 bg-gray-800/30 rounded-lg p-4">
        <h4 className="text-white font-medium mb-3 flex items-center">
          <FileText className="w-4 h-4 mr-2 text-blue-400" />
          Script Format Tips
        </h4>
        <ul className="text-gray-400 text-sm space-y-2">
          <li className="flex items-start">
            <span className="text-pink-400 mr-2">•</span>
            <span>Use "SPEAKER:" or "Speaker:" format for dialogue</span>
          </li>
          <li className="flex items-start">
            <span className="text-pink-400 mr-2">•</span>
            <span>Each line should be on a separate line</span>
          </li>
          <li className="flex items-start">
            <span className="text-pink-400 mr-2">•</span>
            <span>Stage directions can be included without speaker tags</span>
          </li>
          <li className="flex items-start">
            <span className="text-pink-400 mr-2">•</span>
            <span>For songs, use [Verse], [Chorus] etc. as section markers</span>
          </li>
        </ul>
      </div>
    </motion.div>
  )
}
