"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Settings, Volume2, X } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { useDynamicPosition } from "@/hooks/use-dynamic-position"

interface VoiceSettingsProps {
  voices: SpeechSynthesisVoice[]
  selectedVoice?: SpeechSynthesisVoice
  onVoiceChange: (voice: SpeechSynthesisVoice) => void
  onTestVoice: (voice: SpeechSynthesisVoice) => void
}

export function VoiceSettings({ voices, selectedVoice, onVoiceChange, onTestVoice }: VoiceSettingsProps) {
  const [rate, setRate] = useState([0.9])
  const [pitch, setPitch] = useState([1])

  const { triggerRef, contentRef, position, isVisible, setIsVisible } = useDynamicPosition({
    offset: 8,
    preferredPosition: "top",
  })

  // Filter voices to get good character voices
  const characterVoices = voices.filter(
    (voice) =>
      voice.lang.startsWith("en") &&
      (voice.name.includes("Male") || voice.name.includes("Female") || voice.name.includes("Google")),
  )

  const handleVoiceSelect = (voiceName: string) => {
    const voice = voices.find((v) => v.name === voiceName)
    if (voice) {
      onVoiceChange(voice)
    }
  }

  // Close on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsVisible(false)
      }
    }

    if (isVisible) {
      document.addEventListener("keydown", handleEscape)
      return () => document.removeEventListener("keydown", handleEscape)
    }
  }, [isVisible, setIsVisible])

  return (
    <>
      <Button
        ref={triggerRef}
        type="button"
        variant="ghost"
        size="sm"
        onClick={() => setIsVisible(!isVisible)}
        className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-gray-800/50 transition-colors relative"
        aria-label="Voice Settings"
      >
        <Settings className="w-4 h-4" />
      </Button>

      <AnimatePresence>
        {isVisible && (
          <>
            {/* Backdrop */}
            <motion.div
              className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsVisible(false)}
            />

            {/* Settings Panel */}
            <motion.div
              ref={contentRef}
              className="fixed z-50 w-80 max-w-[calc(100vw-2rem)] bg-gray-900 border border-gray-700 rounded-lg shadow-xl"
              style={{
                top: position.top,
                bottom: position.bottom,
                left: position.left,
                right: position.right,
              }}
              initial={{ opacity: 0, scale: 0.95, y: -10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -10 }}
              transition={{ type: "spring", duration: 0.2 }}
            >
              <div className="p-4 max-h-[80vh] overflow-y-auto">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-white font-semibold flex items-center">
                    <Volume2 className="w-4 h-4 mr-2 text-pink-400" />
                    Voice Settings
                  </h3>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsVisible(false)}
                    className="text-gray-400 hover:text-white p-1"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>

                <div className="space-y-4">
                  {/* Voice Selection */}
                  <div>
                    <label className="text-sm text-gray-300 mb-2 block">AI Voice</label>
                    <Select onValueChange={handleVoiceSelect} value={selectedVoice?.name}>
                      <SelectTrigger className="bg-gray-800 border-gray-600 text-white">
                        <SelectValue placeholder="Select a voice" />
                      </SelectTrigger>
                      <SelectContent className="bg-gray-800 border-gray-600 max-h-48 overflow-y-auto">
                        {characterVoices.map((voice) => (
                          <SelectItem key={voice.name} value={voice.name} className="text-white hover:bg-gray-700">
                            <div className="flex items-center justify-between w-full">
                              <span className="truncate">{voice.name.split(" ")[0]}</span>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={(e) => {
                                  e.stopPropagation()
                                  onTestVoice(voice)
                                }}
                                className="ml-2 h-6 px-2 text-xs shrink-0"
                              >
                                Test
                              </Button>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Rate Control */}
                  <div>
                    <label className="text-sm text-gray-300 mb-2 block">Speaking Rate: {rate[0].toFixed(1)}x</label>
                    <Slider value={rate} onValueChange={setRate} max={2} min={0.5} step={0.1} className="w-full" />
                  </div>

                  {/* Pitch Control */}
                  <div>
                    <label className="text-sm text-gray-300 mb-2 block">Pitch: {pitch[0].toFixed(1)}</label>
                    <Slider value={pitch} onValueChange={setPitch} max={2} min={0.5} step={0.1} className="w-full" />
                  </div>

                  {/* Quick Actions */}
                  <div className="pt-2 border-t border-gray-700">
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setRate([1])
                          setPitch([1])
                        }}
                        className="flex-1 text-xs"
                      >
                        Reset
                      </Button>
                      {selectedVoice && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => onTestVoice(selectedVoice)}
                          className="flex-1 text-xs"
                        >
                          Test Voice
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
