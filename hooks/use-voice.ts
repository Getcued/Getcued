"use client"

import { useState, useRef, useCallback, useEffect } from "react"

interface UseVoiceOptions {
  onTranscript?: (transcript: string) => void
  onError?: (error: string) => void
  language?: string
}

export function useVoice({ onTranscript, onError, language = "en-US" }: UseVoiceOptions = {}) {
  const [isListening, setIsListening] = useState(false)
  const [isSupported, setIsSupported] = useState(false)
  const [transcript, setTranscript] = useState("")
  const [confidence, setConfidence] = useState(0)
  const [hasPermission, setHasPermission] = useState<boolean | null>(null)

  const recognitionRef = useRef<any>(null)
  const synthRef = useRef<SpeechSynthesis | null>(null)
  const isInitializedRef = useRef(false)
  const restartTimeoutRef = useRef<NodeJS.Timeout>()

  const initializeSpeechRecognition = useCallback(() => {
    if (isInitializedRef.current) return

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
    const speechSynthesis = window.speechSynthesis

    if (!SpeechRecognition || !speechSynthesis) {
      setIsSupported(false)
      return
    }

    setIsSupported(true)

    try {
      const recognition = new SpeechRecognition()
      recognition.continuous = false // Changed to false to prevent aborted errors
      recognition.interimResults = true
      recognition.lang = language
      recognition.maxAlternatives = 1

      recognition.onstart = () => {
        console.log("Speech recognition started")
        setIsListening(true)
      }

      recognition.onresult = (event: any) => {
        let finalTranscript = ""
        let interimTranscript = ""

        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript
          const confidence = event.results[i][0].confidence

          if (event.results[i].isFinal) {
            finalTranscript += transcript
            setConfidence(confidence || 0)
          } else {
            interimTranscript += transcript
          }
        }

        const fullTranscript = finalTranscript || interimTranscript
        setTranscript(fullTranscript)

        if (finalTranscript && onTranscript) {
          onTranscript(finalTranscript.trim())
        }
      }

      recognition.onerror = (event: any) => {
        console.error("Speech recognition error:", event.error)
        setIsListening(false)

        // Handle different error types
        switch (event.error) {
          case "not-allowed":
            setHasPermission(false)
            if (onError) {
              onError("Microphone access denied. Please allow microphone access and try again.")
            }
            break
          case "no-speech":
            // This is normal, just restart if needed
            console.log("No speech detected, will restart if needed")
            break
          case "aborted":
            // This happens when recognition is stopped manually, usually not an error
            console.log("Speech recognition was stopped")
            break
          case "network":
            if (onError) {
              onError("Network error occurred. Please check your connection.")
            }
            break
          default:
            if (onError) {
              onError(`Speech recognition error: ${event.error}`)
            }
        }
      }

      recognition.onend = () => {
        console.log("Speech recognition ended")
        setIsListening(false)

        // Clear any pending restart
        if (restartTimeoutRef.current) {
          clearTimeout(restartTimeoutRef.current)
        }
      }

      recognitionRef.current = recognition
      synthRef.current = speechSynthesis
      isInitializedRef.current = true
    } catch (error) {
      console.error("Failed to initialize speech recognition:", error)
      setIsSupported(false)
      if (onError) {
        onError("Failed to initialize speech recognition")
      }
    }
  }, [language, onTranscript, onError])

  useEffect(() => {
    // Check for microphone permission first
    if (navigator.permissions) {
      navigator.permissions
        .query({ name: "microphone" as PermissionName })
        .then((result) => {
          setHasPermission(result.state === "granted")
          if (result.state === "granted") {
            initializeSpeechRecognition()
          }
        })
        .catch(() => {
          // Fallback if permissions API is not available
          initializeSpeechRecognition()
        })
    } else {
      // Fallback if permissions API is not available
      initializeSpeechRecognition()
    }

    return () => {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop()
        } catch (error) {
          console.log("Error stopping recognition:", error)
        }
      }
      if (restartTimeoutRef.current) {
        clearTimeout(restartTimeoutRef.current)
      }
    }
  }, [initializeSpeechRecognition])

  const startListening = useCallback(async () => {
    if (!isSupported) {
      if (onError) {
        onError("Speech recognition is not supported in this browser")
      }
      return
    }

    if (isListening || !recognitionRef.current) {
      return
    }

    // Request microphone permission if not already granted
    if (hasPermission === false) {
      try {
        await navigator.mediaDevices.getUserMedia({ audio: true })
        setHasPermission(true)
      } catch (error) {
        setHasPermission(false)
        if (onError) {
          onError("Microphone access is required for voice input")
        }
        return
      }
    }

    try {
      setTranscript("")
      recognitionRef.current.start()
    } catch (error: any) {
      console.error("Error starting recognition:", error)
      setIsListening(false)

      if (error.name === "InvalidStateError") {
        // Recognition is already running, stop it first
        try {
          recognitionRef.current.stop()
          // Restart after a short delay
          restartTimeoutRef.current = setTimeout(() => {
            if (recognitionRef.current) {
              recognitionRef.current.start()
            }
          }, 100)
        } catch (stopError) {
          console.error("Error stopping recognition:", stopError)
        }
      } else if (onError) {
        onError(`Failed to start voice recognition: ${error.message}`)
      }
    }
  }, [isSupported, isListening, hasPermission, onError])

  const stopListening = useCallback(() => {
    if (recognitionRef.current && isListening) {
      try {
        recognitionRef.current.stop()
      } catch (error) {
        console.error("Error stopping recognition:", error)
      }
    }

    // Clear any pending restart
    if (restartTimeoutRef.current) {
      clearTimeout(restartTimeoutRef.current)
    }
  }, [isListening])

  const speak = useCallback((text: string, voice?: SpeechSynthesisVoice) => {
    if (synthRef.current) {
      // Cancel any ongoing speech
      synthRef.current.cancel()

      const utterance = new SpeechSynthesisUtterance(text)

      if (voice) {
        utterance.voice = voice
      }

      // Configure voice settings
      utterance.rate = 0.9
      utterance.pitch = 1
      utterance.volume = 0.8

      synthRef.current.speak(utterance)

      return utterance
    }
  }, [])

  const getVoices = useCallback(() => {
    if (synthRef.current) {
      return synthRef.current.getVoices()
    }
    return []
  }, [])

  const stopSpeaking = useCallback(() => {
    if (synthRef.current) {
      synthRef.current.cancel()
    }
  }, [])

  return {
    isListening,
    isSupported,
    transcript,
    confidence,
    hasPermission,
    startListening,
    stopListening,
    speak,
    stopSpeaking,
    getVoices,
  }
}
