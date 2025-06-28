"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"

interface CarouselItem {
  id: string
  content: React.ReactNode
}

interface EnhancedCarouselProps {
  items: CarouselItem[]
  autoPlay?: boolean
  autoPlayInterval?: number
  showDots?: boolean
  showArrows?: boolean
  className?: string
}

export function EnhancedCarousel({
  items,
  autoPlay = true,
  autoPlayInterval = 5000,
  showDots = true,
  showArrows = true,
  className = "",
}: EnhancedCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [direction, setDirection] = useState(0)

  useEffect(() => {
    if (!autoPlay) return

    const interval = setInterval(() => {
      setDirection(1)
      setCurrentIndex((prev) => (prev + 1) % items.length)
    }, autoPlayInterval)

    return () => clearInterval(interval)
  }, [autoPlay, autoPlayInterval, items.length])

  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 1000 : -1000,
      opacity: 0,
      scale: 0.8,
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1,
      scale: 1,
    },
    exit: (direction: number) => ({
      zIndex: 0,
      x: direction < 0 ? 1000 : -1000,
      opacity: 0,
      scale: 0.8,
    }),
  }

  const swipeConfidenceThreshold = 10000
  const swipePower = (offset: number, velocity: number) => {
    return Math.abs(offset) * velocity
  }

  const paginate = (newDirection: number) => {
    setDirection(newDirection)
    setCurrentIndex((prev) => {
      if (newDirection === 1) {
        return (prev + 1) % items.length
      } else {
        return prev === 0 ? items.length - 1 : prev - 1
      }
    })
  }

  return (
    <div className={`relative overflow-hidden ${className}`}>
      <div className="relative h-full">
        <AnimatePresence initial={false} custom={direction}>
          <motion.div
            key={currentIndex}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{
              x: { type: "spring", stiffness: 300, damping: 30 },
              opacity: { duration: 0.2 },
              scale: { duration: 0.4 },
            }}
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={1}
            onDragEnd={(e, { offset, velocity }) => {
              const swipe = swipePower(offset.x, velocity.x)

              if (swipe < -swipeConfidenceThreshold) {
                paginate(1)
              } else if (swipe > swipeConfidenceThreshold) {
                paginate(-1)
              }
            }}
            className="absolute inset-0"
          >
            {items[currentIndex]?.content}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Navigation Arrows */}
      {showArrows && (
        <>
          <Button
            variant="ghost"
            size="icon"
            className="absolute left-4 top-1/2 -translate-y-1/2 z-10 bg-black/20 backdrop-blur-sm hover:bg-black/40 text-white border-white/20"
            onClick={() => paginate(-1)}
          >
            <ChevronLeft className="w-6 h-6" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-4 top-1/2 -translate-y-1/2 z-10 bg-black/20 backdrop-blur-sm hover:bg-black/40 text-white border-white/20"
            onClick={() => paginate(1)}
          >
            <ChevronRight className="w-6 h-6" />
          </Button>
        </>
      )}

      {/* Dots Indicator */}
      {showDots && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2 z-10">
          {items.map((_, index) => (
            <button
              key={index}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                index === currentIndex
                  ? "bg-white scale-125 shadow-lg"
                  : "bg-white/50 hover:bg-white/70 backdrop-blur-sm"
              }`}
              onClick={() => {
                setDirection(index > currentIndex ? 1 : -1)
                setCurrentIndex(index)
              }}
            />
          ))}
        </div>
      )}
    </div>
  )
}
