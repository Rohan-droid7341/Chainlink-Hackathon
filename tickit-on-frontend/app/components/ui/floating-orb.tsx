"use client"

import { motion } from "framer-motion"

interface FloatingOrbProps {
  size?: "sm" | "md" | "lg"
  color?: "blue" | "purple" | "green" | "orange" | "pink"
  className?: string
}

export function FloatingOrb({ size = "md", color = "blue", className = "" }: FloatingOrbProps) {
  const sizeClasses = {
    sm: "w-8 h-8",
    md: "w-12 h-12",
    lg: "w-16 h-16",
  }

  const colorClasses = {
    blue: "from-blue-400 to-cyan-400",
    purple: "from-purple-400 to-pink-400",
    green: "from-green-400 to-emerald-400",
    orange: "from-orange-400 to-red-400",
    pink: "from-pink-400 to-rose-400",
  }

  return (
    <motion.div
      className={`absolute ${sizeClasses[size]} ${className}`}
      animate={{
        y: [0, -10, 0],
        rotate: [0, 180, 360],
      }}
      transition={{
        duration: 4,
        repeat: Number.POSITIVE_INFINITY,
        ease: "easeInOut",
      }}
    >
      <div className={`w-full h-full rounded-full bg-gradient-to-br ${colorClasses[color]} opacity-60 blur-sm`} />
      <div className={`absolute inset-2 rounded-full bg-gradient-to-br ${colorClasses[color]} opacity-80`} />
    </motion.div>
  )
}
