"use client"

import { motion } from "framer-motion"
import type { ReactNode } from "react"

interface EnhancedCardProps {
  children: ReactNode
  className?: string
  hover?: boolean
}

export function EnhancedCard({ children, className = "", hover = true }: EnhancedCardProps) {
  return (
    <motion.div
      className={`
        relative overflow-hidden rounded-xl
        bg-gradient-to-br from-white/10 to-white/5
        backdrop-blur-md border border-white/20
        shadow-2xl shadow-blue-500/10
        ${className}
      `}
      whileHover={hover ? { scale: 1.02, y: -5 } : {}}
      transition={{ duration: 0.3, ease: "easeOut" }}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-purple-500/5 to-transparent opacity-50" />
      <div className="relative z-10">{children}</div>
    </motion.div>
  )
}
