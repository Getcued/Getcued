"use client"

import { useState, useCallback, useRef } from "react"
import type { SpeechRecognition, SpeechSynthesis, SpeechSynthesisVoice } from "web-speech-api"

interface UseVoiceOptions {
  onTranscript?: (text: string) => void
  onError?: (error: string) => void
}

export function useVoice({ onTranscript, onError }: UseVoiceOptions = {}) {
  const [isListening, setIsListening] = useState(false)
  const [transcript, setTranscript] = useState("")
  const [hasPermission, setHasPermission] = useState<boolean | null>(null)

  const recognitionRef = useRef<SpeechRecognition | null>(null)
  const synthRef = useRef<SpeechSynthesis | null>(null)

  const isSupported =
    typeof window !== "undefined" &&
    ("SpeechRecognition" in window || "webkitSpeechRecognition" in window) &&
    "speechSynthesis" in window

  const startListening = useCallback(async () => {
    if (!isSupported) {
      onError?.("Speech recognition not supported")
      return
    }

    try {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
      const recognition = new SpeechRecognition()

      recognition.continuous = true
      recognition.interimResults = true
      recognition.lang = "en-US"

      recognition.onstart = () => {
        setIsListening(true)
        setHasPermission(true)
      }

      recognition.onresult = (event) => {
        let finalTranscript = ""

        for (let i = event.resultIndex; i < event.results.length; i++) {
          const result = event.results[i]
          if (result.isFinal) {
            finalTranscript += result[0].transcript
          }
        }

        if (finalTranscript) {
          setTranscript(finalTranscript)
          onTranscript?.(finalTranscript)
        }
      }

      recognition.onerror = (event) => {
        setIsListening(false)
        if (event.error === "not-allowed") {
          setHasPermission(false)
          onError?.("Microphone access denied")
        } else {
          onError?.(`Speech recognition error: ${event.error}`)
        }
      }

      recognition.onend = () => {
        setIsListening(false)
      }

      recognitionRef.current = recognition
      recognition.start()
    } catch (error) {
      onError?.("Failed to start speech recognition")
      setIsListening(false)
    }
  }, [isSupported, onTranscript, onError])

  const stopListening = useCallback(() => {
    if (recognitionRef.current) {
      recognitionRef.current.stop()
      recognitionRef.current = null
    }
    setIsListening(false)
  }, [])

  const speak = useCallback(
    (text: string, voice?: SpeechSynthesisVoice) => {
      if (!isSupported || !window.speechSynthesis) return null

      const utterance = new SpeechSynthesisUtterance(text)

      if (voice) {
        utterance.voice = voice
      }

      utterance.rate = 0.9
      utterance.pitch = 1
      utterance.volume = 0.8

      window.speechSynthesis.speak(utterance)
      return utterance
    },
    [isSupported],
  )

  const stopSpeaking = useCallback(() => {
    if (window.speechSynthesis) {
      window.speechSynthesis.cancel()
    }
  }, [])

  const getVoices = useCallback(() => {
    if (!isSupported || !window.speechSynthesis) return []
    return window.speechSynthesis.getVoices()
  }, [isSupported])

  return {
    isListening,
    transcript,
    hasPermission,
    isSupported,
    startListening,
    stopListening,
    speak,
    stopSpeaking,
    getVoices,
  }
}
