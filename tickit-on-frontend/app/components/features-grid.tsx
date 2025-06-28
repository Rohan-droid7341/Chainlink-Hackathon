"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Ticket, Globe, ImageIcon, Repeat } from "lucide-react"
import { motion } from "framer-motion"

const features = [
  {
    icon: Ticket,
    title: "Dynamic Ticket Prices",
    description: "Prices increase as more tickets are sold — incentivize early buyers.",
  },
  {
    icon: Globe,
    title: "Cross-Chain Access",
    description: "Buy tickets using ETH, MATIC, or AVAX. Pay CCIP fees only when needed.",
  },
  {
    icon: ImageIcon,
    title: "NFT Ticketing",
    description: "Each ticket is minted as an NFT with event metadata and QR code.",
  },
  {
    icon: Repeat,
    title: "Resale System",
    description: "Smart contracts enforce automatic resale splits (90% seller, 70/30 rest).",
  },
]

export default function FeaturesGrid() {
  return (
    <section id="features" className="py-16 bg-background text-foreground relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-darkblue-950/20 to-darkblue-800/20 opacity-50 z-0"></div>
      <div className="container mx-auto px-4 text-center relative z-10">
        <motion.h2
          className="text-3xl md:text-4xl font-bold mb-12 drop-shadow"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          Platform Benefits
        </motion.h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 50, scale: 0.9 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              whileHover={{ scale: 1.05, y: -10 }}
              transition={{
                duration: 0.6,
                delay: index * 0.1,
                ease: "easeOut",
              }}
              viewport={{ once: true, amount: 0.3 }}
            >
              <Card className="bg-card border-border text-foreground h-full flex flex-col shadow-lg hover:shadow-xl transition-shadow duration-300">
                <CardHeader className="flex flex-col items-center text-center">
                  <feature.icon className="w-12 h-12 mb-4 text-primary" />
                  <CardTitle className="text-xl font-semibold">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent className="flex-grow flex items-center justify-center">
                  <p className="text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
