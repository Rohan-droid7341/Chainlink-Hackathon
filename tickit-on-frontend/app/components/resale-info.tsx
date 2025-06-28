"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { motion } from "framer-motion"
import { DollarSign, Percent, LinkIcon, Repeat } from "lucide-react"

const resalePoints = [
  {
    icon: DollarSign,
    title: "Seller Payout",
    description: "The original ticket seller receives 90% of their original purchase price.",
  },
  {
    icon: Percent,
    title: "Platform & Organizer Split",
    description: "The remaining 10% is split: 70% to the platform, 30% to the event organizer.",
  },
  {
    icon: Repeat,
    title: "Dynamic Market Price",
    description: "New buyers pay the current dynamic market price, which can fluctuate.",
  },
  {
    icon: LinkIcon,
    title: "Cross-Chain Enabled",
    description: "Resales can occur across supported chains, facilitated by Chainlink CCIP.",
  },
]

export default function ResaleInfo() {
  return (
    <section id="resale-mechanics" className="relative py-16 bg-background text-foreground overflow-hidden">
      {/* Background Gradient Overlays for dark theme consistency with Hero Section */}
      <div className="absolute inset-0 bg-gradient-to-br from-darkblue-950/40 to-darkblue-800/40 z-0"></div>
      <div className="absolute inset-0 bg-radial-gradient-at-center from-darkblue-900/50 to-transparent z-0 animate-fade-in"></div>

      <div className="container mx-auto px-4 text-center relative z-10">
        <motion.h2
          className="text-3xl md:text-4xl font-bold mb-12 drop-shadow"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          Resale Mechanics
        </motion.h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {resalePoints.map((point, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.8, y: 40 }}
              whileInView={{ opacity: 1, scale: 1, y: 0 }}
              whileHover={{ scale: 1.05, y: -8 }}
              transition={{
                duration: 0.6,
                delay: index * 0.2,
                ease: "easeOut",
              }}
              viewport={{ once: true, amount: 0.3 }}
            >
              <Card className="bg-card border-border text-foreground h-full flex flex-col shadow-lg hover:shadow-xl transition-shadow duration-300">
                <CardHeader className="flex flex-col items-center text-center">
                  <point.icon className="w-10 h-10 mb-3 text-primary" />
                  <CardTitle className="text-xl font-semibold">{point.title}</CardTitle>
                </CardHeader>
                <CardContent className="flex-grow flex items-center justify-center">
                  <p className="text-muted-foreground">{point.description}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
