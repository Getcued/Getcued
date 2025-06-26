"use client"

import { useEffect, useRef } from "react"
import { motion } from "framer-motion"

export function GradientHeadline() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    canvas.width = canvas.offsetWidth * window.devicePixelRatio
    canvas.height = canvas.offsetHeight * window.devicePixelRatio

    const colors = [
      "#FF1493", // hot pink
      "#FF8C00", // orange
      "#FFD700", // gold
      "#1E90FF", // blue
      "#9370DB", // purple
    ]

    let time = 0

    const animate = () => {
      time += 0.005

      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // Create gradient
      const gradient = ctx.createLinearGradient(
        canvas.width * (0.5 + 0.4 * Math.sin(time)),
        0,
        canvas.width * (0.5 + 0.4 * Math.sin(time + 2)),
        canvas.height,
      )

      // Add color stops
      colors.forEach((color, i) => {
        const offset = (i / (colors.length - 1) + time * 0.2) % 1
        gradient.addColorStop(offset, color)
      })

      // Fill text with gradient
      ctx.fillStyle = gradient
      ctx.font = `bold ${canvas.height * 0.8}px Inter, sans-serif`
      ctx.textAlign = "center"
      ctx.textBaseline = "middle"
      ctx.fillText("Get cued.", canvas.width / 2, canvas.height / 2)

      requestAnimationFrame(animate)
    }

    animate()

    const handleResize = () => {
      canvas.width = canvas.offsetWidth * window.devicePixelRatio
      canvas.height = canvas.offsetHeight * window.devicePixelRatio
    }

    window.addEventListener("resize", handleResize)

    return () => {
      window.removeEventListener("resize", handleResize)
    }
  }, [])

  return (
    <motion.div
      className="w-full relative"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 1 }}
    >
      <canvas ref={canvasRef} className="w-full h-12 md:h-16 lg:h-20" style={{ display: "block" }} />
      <h1 className="sr-only">Get cued.</h1>
    </motion.div>
  )
}
