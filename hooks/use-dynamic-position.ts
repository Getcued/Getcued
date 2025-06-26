"use client"

import { useState, useEffect, useRef, useCallback } from "react"

interface Position {
  top?: number
  bottom?: number
  left?: number
  right?: number
}

interface UseDynamicPositionOptions {
  offset?: number
  preferredPosition?: "top" | "bottom" | "left" | "right"
}

export function useDynamicPosition({ offset = 8, preferredPosition = "bottom" }: UseDynamicPositionOptions = {}) {
  const [position, setPosition] = useState<Position>({})
  const [isVisible, setIsVisible] = useState(false)
  const triggerRef = useRef<HTMLElement>(null)
  const contentRef = useRef<HTMLElement>(null)

  const updatePosition = useCallback(() => {
    if (!triggerRef.current || !contentRef.current || !isVisible) return

    const triggerRect = triggerRef.current.getBoundingClientRect()
    const contentRect = contentRef.current.getBoundingClientRect()
    const viewport = {
      width: window.innerWidth,
      height: window.innerHeight,
    }

    const newPosition: Position = {}

    // Calculate horizontal position
    const spaceRight = viewport.width - triggerRect.right
    const spaceLeft = triggerRect.left
    const contentWidth = contentRect.width || 320 // fallback width

    if (spaceRight >= contentWidth) {
      // Position to the right of trigger
      newPosition.left = triggerRect.right + offset
    } else if (spaceLeft >= contentWidth) {
      // Position to the left of trigger
      newPosition.right = viewport.width - triggerRect.left + offset
    } else {
      // Center horizontally with padding
      const padding = 16
      newPosition.left = Math.max(padding, (viewport.width - contentWidth) / 2)
    }

    // Calculate vertical position
    const spaceBelow = viewport.height - triggerRect.bottom
    const spaceAbove = triggerRect.top
    const contentHeight = contentRect.height || 400 // fallback height

    if (preferredPosition === "bottom" && spaceBelow >= contentHeight) {
      newPosition.top = triggerRect.bottom + offset
    } else if (preferredPosition === "top" && spaceAbove >= contentHeight) {
      newPosition.bottom = viewport.height - triggerRect.top + offset
    } else if (spaceBelow >= contentHeight) {
      newPosition.top = triggerRect.bottom + offset
    } else if (spaceAbove >= contentHeight) {
      newPosition.bottom = viewport.height - triggerRect.top + offset
    } else {
      // Not enough space above or below, center vertically
      const padding = 16
      newPosition.top = Math.max(padding, (viewport.height - contentHeight) / 2)
    }

    setPosition(newPosition)
  }, [isVisible, offset, preferredPosition])

  useEffect(() => {
    if (isVisible) {
      updatePosition()
      window.addEventListener("resize", updatePosition)
      window.addEventListener("scroll", updatePosition)

      return () => {
        window.removeEventListener("resize", updatePosition)
        window.removeEventListener("scroll", updatePosition)
      }
    }
  }, [isVisible, updatePosition])

  return {
    triggerRef,
    contentRef,
    position,
    isVisible,
    setIsVisible,
  }
}
