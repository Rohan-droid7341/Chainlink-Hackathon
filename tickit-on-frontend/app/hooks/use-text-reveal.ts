"use client"

import { useState, useEffect } from "react"

interface UseTextRevealProps {
  text: string
  delay?: number
  duration?: number
}

export function useTextReveal({ text, delay = 0, duration = 1000 }: UseTextRevealProps) {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true)
    }, delay)

    return () => clearTimeout(timer)
  }, [delay])

  return { isVisible, duration }
}
