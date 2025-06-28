"use client"

import { motion } from "framer-motion"
import type { ReactNode } from "react"

interface GradientBorderProps {
  children: ReactNode
  className?: string
}

export function GradientBorder({ children, className = "" }: GradientBorderProps) {
  return (
    <motion.div
      className={`relative p-[1px] rounded-xl bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 ${className}`}
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.3 }}
    >
      <div className="bg-background rounded-xl h-full w-full">{children}</div>
    </motion.div>
  )
}
