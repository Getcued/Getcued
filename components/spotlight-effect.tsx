"use client"

import { useEffect, useState } from "react"

export function SpotlightEffect() {
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const [opacity, setOpacity] = useState(0)

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY })
      setOpacity(0.15) // Show spotlight when mouse moves
    }

    const handleMouseLeave = () => {
      setOpacity(0) // Hide spotlight when mouse leaves
    }

    // Add event listeners
    window.addEventListener("mousemove", handleMouseMove)
    document.body.addEventListener("mouseleave", handleMouseLeave)

    // Initial fade-in
    const timer = setTimeout(() => {
      setOpacity(0.1)
    }, 500)

    // Clean up
    return () => {
      window.removeEventListener("mousemove", handleMouseMove)
      document.body.removeEventListener("mouseleave", handleMouseLeave)
      clearTimeout(timer)
    }
  }, [])

  return (
    <div
      className="pointer-events-none fixed inset-0 z-30 transition duration-300 lg:absolute"
      style={{
        background: `radial-gradient(600px circle at ${position.x}px ${position.y}px, rgba(255,20,147,${opacity * 0.3}), rgba(255,140,0,${opacity * 0.2}), rgba(255,215,0,${opacity * 0.1}), transparent 40%)`,
      }}
      aria-hidden="true"
    />
  )
}
