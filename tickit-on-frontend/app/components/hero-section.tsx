"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"
import { Ticket, EclipseIcon as Ethereum, OctagonIcon as Polygon, MountainSnowIcon as Avalanche } from "lucide-react"
import { useTextReveal } from "@/hooks/use-text-reveal"
import { FloatingParticles } from "@/components/ui/floating-particles"
import { Spotlight } from "@/components/ui/spotlight"
import { TextReveal } from "@/components/ui/text-reveal"
import { GradientBorder } from "@/components/ui/gradient-border"

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
      {/* Enhanced Background Effects */}
      <FloatingParticles />
      <Spotlight />

      {/* Animated Background Gradients */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-br from-blue-600/20 via-purple-600/10 to-pink-600/20"
        animate={{
          background: [
            "linear-gradient(45deg, rgba(59, 130, 246, 0.2), rgba(147, 51, 234, 0.1), rgba(236, 72, 153, 0.2))",
            "linear-gradient(45deg, rgba(147, 51, 234, 0.2), rgba(236, 72, 153, 0.1), rgba(59, 130, 246, 0.2))",
            "linear-gradient(45deg, rgba(236, 72, 153, 0.2), rgba(59, 130, 246, 0.1), rgba(147, 51, 234, 0.2))",
          ],
        }}
        transition={{ duration: 8, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
      />

      <div className="absolute inset-0 bg-gradient-to-br from-darkblue-950/40 to-darkblue-800/40"></div>

      {/* Text Content (Left Side) */}
      <motion.div
        className="relative z-20 max-w-xl text-center md:text-left space-y-6 mb-12 md:mb-0 md:mr-12 flex-shrink-0"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ staggerChildren: 0.15, delayChildren: 1.2 }}
      >
        {/* Animated Heading with Enhanced Effects */}
        <div className="space-y-4">
          <TextReveal delay={0.3}>
            <motion.h1
              className="text-4xl md:text-6xl font-bold tracking-tight leading-tight drop-shadow-lg"
              initial={{ opacity: 0, y: 50, scale: 0.9 }}
              animate={showMainHeading ? { opacity: 1, y: 0, scale: 1 } : { opacity: 0, y: 50, scale: 0.9 }}
              transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
            >
              <span className="bg-gradient-to-r from-white via-blue-200 to-purple-300 bg-clip-text text-transparent animate-pulse">
                Cross-Chain NFT Tickets.
              </span>
            </motion.h1>
          </TextReveal>

          <TextReveal delay={0.6}>
            <motion.h2
              className="text-3xl md:text-5xl font-bold tracking-tight leading-tight drop-shadow-lg"
              initial={{ opacity: 0, y: 30, x: -20 }}
              animate={showSubHeading ? { opacity: 1, y: 0, x: 0 } : { opacity: 0, y: 30, x: -20 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
            >
              <span className="bg-gradient-to-r from-blue-300 via-purple-300 to-pink-300 bg-clip-text text-transparent">
                Buy from Any Network. Sell Anytime.
              </span>
            </motion.h2>
          </TextReveal>
        </div>

        <TextReveal delay={0.9}>
          <motion.p
            className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto md:mx-0 drop-shadow backdrop-blur-sm"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1.4, ease: "easeOut" }}
          >
            A decentralized event ticketing platform powered by Chainlink CCIP. Dynamic pricing. Smart resales. Native
            token payments.
          </motion.p>
        </TextReveal>

        <TextReveal delay={1.2}>
          <motion.div
            className="flex flex-col sm:flex-row justify-center md:justify-start gap-4"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1.6, ease: "easeOut" }}
          >
            <GradientBorder>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button
                  asChild
                  className="bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700 px-8 py-3 text-lg rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 border-0"
                >
                  <Link href="#events">🎟️ Browse Events</Link>
                </Button>
              </motion.div>
            </GradientBorder>

            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                asChild
                variant="outline"
                className="bg-white/10 backdrop-blur-md text-foreground border-white/20 hover:bg-white/20 px-8 py-3 text-lg rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <Link href="#host">📤 Host an Event</Link>
              </Button>
            </motion.div>

            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                asChild
                variant="outline"
                className="bg-white/10 backdrop-blur-md text-foreground border-white/20 hover:bg-white/20 px-8 py-3 text-lg rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <Link href="#dashboard">📥 My Dashboard</Link>
              </Button>
            </motion.div>
          </motion.div>
        </TextReveal>
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
          {/* Central Ticket with Glow Effect */}
          <motion.div
            className="relative"
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
            <div className="absolute inset-0 bg-blue-500 rounded-full blur-xl opacity-30 animate-pulse" />
            <Ticket className="relative w-24 h-24 md:w-28 md:h-28 text-primary z-10 drop-shadow-2xl" />
          </motion.div>

          {/* Enhanced Chain Icons with Glow */}
          <motion.div
            className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2"
            initial={{ opacity: 0, scale: 0, rotate: -180 }}
            animate={{ opacity: 0.9, scale: 1, rotate: 0 }}
            whileHover={{ scale: 1.3, rotate: 360 }}
            transition={{
              delay: 1.7,
              duration: 0.8,
              ease: "easeOut",
            }}
          >
            <div className="absolute inset-0 bg-purple-500 rounded-full blur-lg opacity-40" />
            <Ethereum className="relative w-12 h-12 md:w-14 md:h-14 text-purple-400 drop-shadow-2xl" />
          </motion.div>

          <motion.div
            className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2"
            initial={{ opacity: 0, scale: 0, rotate: -180 }}
            animate={{ opacity: 0.9, scale: 1, rotate: 0 }}
            whileHover={{ scale: 1.3, rotate: 360 }}
            transition={{
              delay: 1.9,
              duration: 0.8,
              ease: "easeOut",
            }}
          >
            <div className="absolute inset-0 bg-blue-500 rounded-full blur-lg opacity-40" />
            <Polygon className="relative w-12 h-12 md:w-14 md:h-14 text-blue-400 drop-shadow-2xl" />
          </motion.div>

          <motion.div
            className="absolute top-1/2 right-0 translate-x-1/2 -translate-y-1/2"
            initial={{ opacity: 0, scale: 0, rotate: -180 }}
            animate={{ opacity: 0.9, scale: 1, rotate: 0 }}
            whileHover={{ scale: 1.3, rotate: 360 }}
            transition={{
              delay: 2.1,
              duration: 0.8,
              ease: "easeOut",
            }}
          >
            <div className="absolute inset-0 bg-red-500 rounded-full blur-lg opacity-40" />
            <Avalanche className="relative w-12 h-12 md:w-14 md:h-14 text-red-400 drop-shadow-2xl" />
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
