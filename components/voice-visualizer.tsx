"use client"

import { useEffect, useRef } from "react"
import { motion } from "framer-motion"

interface VoiceVisualizerProps {
  isActive: boolean
  color?: string
}

export function VoiceVisualizer({ isActive, color = "#ec4899" }: VoiceVisualizerProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animationRef = useRef<number>()
  const audioContextRef = useRef<AudioContext>()
  const analyserRef = useRef<AnalyserNode>()
  const dataArrayRef = useRef<Uint8Array>()

  useEffect(() => {
    if (!isActive) {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
      return
    }

    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Set canvas size
    canvas.width = canvas.offsetWidth * window.devicePixelRatio
    canvas.height = canvas.offsetHeight * window.devicePixelRatio
    ctx.scale(window.devicePixelRatio, window.devicePixelRatio)

    const draw = () => {
      if (!isActive) return

      const width = canvas.offsetWidth
      const height = canvas.offsetHeight

      ctx.clearRect(0, 0, width, height)

      // Create animated bars
      const barCount = 20
      const barWidth = width / barCount
      const time = Date.now() * 0.005

      for (let i = 0; i < barCount; i++) {
        const barHeight = Math.sin(time + i * 0.5) * (height * 0.3) + height * 0.1
        const x = i * barWidth
        const y = (height - Math.abs(barHeight)) / 2

        // Create gradient
        const gradient = ctx.createLinearGradient(0, 0, 0, height)
        gradient.addColorStop(0, color + "40")
        gradient.addColorStop(0.5, color)
        gradient.addColorStop(1, color + "40")

        ctx.fillStyle = gradient
        ctx.fillRect(x + barWidth * 0.1, y, barWidth * 0.8, Math.abs(barHeight))
      }

      animationRef.current = requestAnimationFrame(draw)
    }

    draw()

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [isActive, color])

  if (!isActive) return null

  return (
    <motion.div
      className="w-full h-16 rounded-lg overflow-hidden"
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8 }}
    >
      <canvas ref={canvasRef} className="w-full h-full" />
    </motion.div>
  )
}
