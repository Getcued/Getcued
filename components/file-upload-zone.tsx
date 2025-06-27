"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Upload, X } from "lucide-react"
import { Button } from "@/components/ui/button"

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
  const [isDragging, setIsDragging] = useState(false)

  const handleFileUpload = (file: File) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      const content = e.target?.result as string
      onFileUploaded({
        name: file.name,
        content,
        type: file.type,
      })
    }
    reader.readAsText(file)
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="relative bg-gray-900/50 backdrop-blur-sm border-2 border-dashed border-gray-700 rounded-xl p-8 text-center"
    >
      <Button
        onClick={onClose}
        variant="ghost"
        size="sm"
        className="absolute top-2 right-2 text-gray-400 hover:text-white"
      >
        <X className="w-4 h-4" />
      </Button>

      <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
      <h3 className="text-lg font-semibold text-white mb-2">Upload Your Script</h3>
      <p className="text-gray-400 mb-4">Drag and drop your script file here, or click to browse</p>

      <input
        type="file"
        accept=".txt,.pdf,.doc,.docx"
        onChange={(e) => {
          const file = e.target.files?.[0]
          if (file) handleFileUpload(file)
        }}
        className="hidden"
        id="file-upload"
      />

      <label
        htmlFor="file-upload"
        className="inline-block bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-lg cursor-pointer transition-colors"
      >
        Choose File
      </label>
    </motion.div>
  )
}
