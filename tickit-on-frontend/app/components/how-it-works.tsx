"use client"

import React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { motion } from "framer-motion"
import { Wallet, Ticket, Users, ImageIcon, Repeat, ArrowDown } from "lucide-react"

const steps = [
  {
    icon: Wallet,
    title: "Organizer Stakes",
    description: "Organizers stake tokens on Ethereum, Polygon, or Avalanche to host an event.",
  },
  {
    icon: Ticket,
    title: "Tickets Go Live",
    description: "Event tickets are released with a base price, ready for purchase.",
  },
  {
    icon: Users,
    title: "Cross-Chain Purchases",
    description: "Users buy tickets from any supported chain via Chainlink CCIP.",
  },
  {
    icon: ImageIcon,
    title: "NFT Ticket Minted",
    description: "Each purchased ticket is minted as an NFT and appears in your dashboard.",
  },
  {
    icon: Repeat,
    title: "Optional Resale",
    description: "Resell your NFT ticket anytime with enforced smart contract logic.",
  },
]

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="relative py-16 bg-background text-foreground overflow-hidden">
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
          How It Works
        </motion.h2>
        <div className="flex flex-col items-center">
          {steps.map((step, index) => (
            <React.Fragment key={index}>
              <motion.div
                className="w-full max-w-md"
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.5,
                  delay: index * 0.2,
                  ease: "easeOut",
                }}
                viewport={{ once: true, amount: 0.3 }}
              >
                <Card className="bg-card border-border text-foreground mb-4 shadow-lg hover:shadow-xl transition-shadow duration-300">
                  <CardHeader className="flex flex-col items-center text-center">
                    <step.icon className="w-10 h-10 mb-3 text-primary" />
                    <CardTitle className="text-xl font-semibold">{step.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">{step.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
              {index < steps.length - 1 && (
                <motion.div
                  className="my-2"
                  initial={{ opacity: 0, y: -20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{
                    duration: 0.3,
                    delay: index * 0.2 + 0.2,
                    ease: "easeOut",
                  }}
                  viewport={{ once: true, amount: 0.3 }}
                >
                  <ArrowDown className="w-8 h-8 text-primary animate-bounce" />
                </motion.div>
              )}
            </React.Fragment>
          ))}
        </div>
      </div>
    </section>
  )
}
