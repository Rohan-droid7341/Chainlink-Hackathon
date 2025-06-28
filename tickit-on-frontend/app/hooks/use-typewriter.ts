"use client"

import { useState, useEffect } from "react"

interface UseTypewriterProps {
  text: string
  speed?: number
  delay?: number
}

export function useTypewriter({ text, speed = 50, delay = 0 }: UseTypewriterProps) {
  const [displayText, setDisplayText] = useState("")
  const [isComplete, setIsComplete] = useState(false)

  useEffect(() => {
    let timeoutId: ReturnType<typeof setTimeout>;

    const startTyping = () => {
      let currentIndex = 0

      const typeNextCharacter = () => {
        if (currentIndex < text.length) {
          setDisplayText(text.slice(0, currentIndex + 1))
          currentIndex++
          timeoutId = setTimeout(typeNextCharacter, speed)
        } else {
          setIsComplete(true)
        }
      }

      typeNextCharacter()
    }

    if (delay > 0) {
      timeoutId = setTimeout(startTyping, delay)
    } else {
      startTyping()
    }

    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId)
      }
    }
  }, [text, speed, delay])

  return { displayText, isComplete }
}
