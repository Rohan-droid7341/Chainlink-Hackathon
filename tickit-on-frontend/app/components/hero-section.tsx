"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"
import { Ticket, EclipseIcon as Ethereum, OctagonIcon as Polygon, MountainSnowIcon as Avalanche } from "lucide-react"
import { useTextReveal } from "@/hooks/use-text-reveal"

export default function HeroSection() {
  const { isVisible: showMainHeading } = useTextReveal({
    text: "Cross-Chain NFT Tickets.",
    delay: 300,
    duration: 800,
  })

  const { isVisible: showSubHeading } = useTextReveal({
    text: "Buy from Any Network. Sell Anytime.",
    delay: 800,
    duration: 600,
  })

  return (
    <section className="relative h-screen flex flex-col md:flex-row items-center justify-center md:justify-between px-4 md:px-16 bg-background text-foreground overflow-hidden pt-16">
      {/* Background Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-darkblue-950/40 to-darkblue-800/40"></div>
      <div className="absolute inset-0 bg-radial-gradient-at-center from-darkblue-900/50 to-transparent animate-fade-in"></div>

      {/* Text Content (Left Side) */}
      <motion.div
        className="relative z-20 max-w-xl text-center md:text-left space-y-6 mb-12 md:mb-0 md:mr-12 flex-shrink-0"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ staggerChildren: 0.15, delayChildren: 1.2 }}
      >
        {/* Animated Heading with Modern Effects */}
        <div className="space-y-4">
          <motion.h1
            className="text-4xl md:text-6xl font-bold tracking-tight leading-tight drop-shadow-lg"
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={showMainHeading ? { opacity: 1, y: 0, scale: 1 } : { opacity: 0, y: 50, scale: 0.9 }}
            transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
          >
            <span className="bg-gradient-to-r from-white via-blue-100 to-purple-200 bg-clip-text text-transparent">
              Cross-Chain NFT Tickets.
            </span>
          </motion.h1>

          <motion.h2
            className="text-3xl md:text-5xl font-bold tracking-tight leading-tight drop-shadow-lg"
            initial={{ opacity: 0, y: 30, x: -20 }}
            animate={showSubHeading ? { opacity: 1, y: 0, x: 0 } : { opacity: 0, y: 30, x: -20 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            <span className="bg-gradient-to-r from-blue-200 via-purple-200 to-pink-200 bg-clip-text text-transparent">
              Buy from Any Network. Sell Anytime.
            </span>
          </motion.h2>
        </div>

        <motion.p
          className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto md:mx-0 drop-shadow"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.4, ease: "easeOut" }}
        >
          A decentralized event ticketing platform powered by Chainlink CCIP. Dynamic pricing. Smart resales. Native
          token payments.
        </motion.p>

        <motion.div
          className="flex flex-col sm:flex-row justify-center md:justify-start gap-4"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.6, ease: "easeOut" }}
        >
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button
              asChild
              className="bg-primary text-primary-foreground hover:bg-primary/90 px-8 py-3 text-lg rounded-full shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <Link href="#events">🎟️ Browse Events</Link>
            </Button>
          </motion.div>

          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button
              asChild
              variant="outline"
              className="bg-secondary text-secondary-foreground border-border hover:bg-secondary/90 px-8 py-3 text-lg rounded-full shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <Link href="#host">📤 Host an Event</Link>
            </Button>
          </motion.div>

          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button
              asChild
              variant="outline"
              className="bg-secondary text-secondary-foreground border-border hover:bg-secondary/90 px-8 py-3 text-lg rounded-full shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <Link href="#dashboard">📥 My Dashboard</Link>
            </Button>
          </motion.div>
        </motion.div>
      </motion.div>

      {/* Enhanced Orbiting Animation (Right Side) */}
      <div className="relative z-10 flex items-center justify-center w-full md:w-1/2 h-full opacity-100">
        <motion.div
          className="relative w-80 h-80 md:w-96 md:h-96 flex items-center justify-center"
          initial={{ rotate: 0 }}
          animate={{ rotate: 360 }}
          transition={{
            duration: 20,
            ease: "linear",
            repeat: Number.POSITIVE_INFINITY,
          }}
        >
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{
              scale: 1,
              rotate: 0,
            }}
            transition={{
              delay: 1,
              duration: 1,
              ease: "easeOut",
            }}
          >
            <Ticket className="w-24 h-24 md:w-28 md:h-28 text-primary z-10 drop-shadow-lg" />
          </motion.div>

          <motion.div
            className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2"
            initial={{ opacity: 0, scale: 0, rotate: -180 }}
            animate={{ opacity: 0.9, scale: 1, rotate: 0 }}
            whileHover={{ scale: 1.2, rotate: 360 }}
            transition={{
              delay: 1.7,
              duration: 0.8,
              ease: "easeOut",
            }}
          >
            <Ethereum className="w-12 h-12 md:w-14 md:h-14 text-purple-400 drop-shadow-lg" />
          </motion.div>

          <motion.div
            className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2"
            initial={{ opacity: 0, scale: 0, rotate: -180 }}
            animate={{ opacity: 0.9, scale: 1, rotate: 0 }}
            whileHover={{ scale: 1.2, rotate: 360 }}
            transition={{
              delay: 1.9,
              duration: 0.8,
              ease: "easeOut",
            }}
          >
            <Polygon className="w-12 h-12 md:w-14 md:h-14 text-blue-400 drop-shadow-lg" />
          </motion.div>

          <motion.div
            className="absolute top-1/2 right-0 translate-x-1/2 -translate-y-1/2"
            initial={{ opacity: 0, scale: 0, rotate: -180 }}
            animate={{ opacity: 0.9, scale: 1, rotate: 0 }}
            whileHover={{ scale: 1.2, rotate: 360 }}
            transition={{
              delay: 2.1,
              duration: 0.8,
              ease: "easeOut",
            }}
          >
            <Avalanche className="w-12 h-12 md:w-14 md:h-14 text-red-400 drop-shadow-lg" />
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
