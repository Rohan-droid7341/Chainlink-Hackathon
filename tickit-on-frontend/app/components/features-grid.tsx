"use client"
import { Ticket, Globe, ImageIcon, Repeat } from "lucide-react"
import { motion } from "framer-motion"
import { EnhancedCard } from "@/components/ui/enhanced-card"
import { TextReveal } from "@/components/ui/text-reveal"

const features = [
  {
    icon: Ticket,
    title: "Dynamic Ticket Prices",
    description: "Prices increase as more tickets are sold — incentivize early buyers.",
    gradient: "from-blue-500 to-cyan-500",
  },
  {
    icon: Globe,
    title: "Cross-Chain Access",
    description: "Buy tickets using ETH, MATIC, or AVAX. Pay CCIP fees only when needed.",
    gradient: "from-purple-500 to-pink-500",
  },
  {
    icon: ImageIcon,
    title: "NFT Ticketing",
    description: "Each ticket is minted as an NFT with event metadata and QR code.",
    gradient: "from-green-500 to-teal-500",
  },
  {
    icon: Repeat,
    title: "Resale System",
    description: "Smart contracts enforce automatic resale splits (90% seller, 70/30 rest).",
    gradient: "from-orange-500 to-red-500",
  },
]

export default function FeaturesGrid() {
  return (
    <section id="features" className="py-16 bg-background text-foreground relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-darkblue-950/20 to-darkblue-800/20 opacity-50 z-0"></div>

      <div className="container mx-auto px-4 text-center relative z-10">
        <TextReveal>
          <motion.h2
            className="text-3xl md:text-4xl font-bold mb-12 drop-shadow bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            Platform Benefits
          </motion.h2>
        </TextReveal>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 50, scale: 0.9 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              transition={{
                duration: 0.6,
                delay: index * 0.1,
                ease: "easeOut",
              }}
              viewport={{ once: true, amount: 0.3 }}
            >
              <EnhancedCard className="h-full">
                <div className="p-6 h-full flex flex-col">
                  <div className="flex flex-col items-center text-center mb-4">
                    <div className={`p-3 rounded-xl bg-gradient-to-r ${feature.gradient} mb-4`}>
                      <feature.icon className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-xl font-semibold text-foreground mb-3">{feature.title}</h3>
                  </div>
                  <p className="text-muted-foreground flex-grow flex items-center justify-center text-center">
                    {feature.description}
                  </p>
                </div>
              </EnhancedCard>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
