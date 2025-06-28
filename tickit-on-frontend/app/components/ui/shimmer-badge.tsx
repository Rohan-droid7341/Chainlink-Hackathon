"use client"

import { motion } from "framer-motion"
import type { ReactNode } from "react"

interface ShimmerBadgeProps {
  children: ReactNode
  className?: string
  color?: "blue" | "purple" | "green" | "orange" | "pink"
}

export function ShimmerBadge({ children, className = "", color = "blue" }: ShimmerBadgeProps) {
  const colorClasses = {
    blue: "from-blue-500 to-cyan-500",
    purple: "from-purple-500 to-pink-500",
    green: "from-green-500 to-emerald-500",
    orange: "from-orange-500 to-red-500",
    pink: "from-pink-500 to-rose-500",
  }

  return (
    <motion.div
      className={`relative overflow-hidden rounded-full px-3 py-1 text-xs font-semibold text-white ${className}`}
      whileHover={{ scale: 1.05 }}
      transition={{ duration: 0.2 }}
    >
      <div className={`absolute inset-0 bg-gradient-to-r ${colorClasses[color]}`} />
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
        animate={{
          x: ["-100%", "100%"],
        }}
        transition={{
          duration: 2,
          repeat: Number.POSITIVE_INFINITY,
          ease: "linear",
        }}
      />
      <span className="relative z-10">{children}</span>
    </motion.div>
  )
}
