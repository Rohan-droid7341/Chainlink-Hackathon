"use client"

import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { motion } from "framer-motion"
import type { Event } from "../../lib/types"

// Mock data for events
const mockEvents: Event[] = [
  {
    id: "1",
    title: "Decentralized DevCon 2025",
    banner: "/placeholder.svg?height=300&width=500",
    organizer: "Web3 Builders DAO",
    date: "Oct 26, 2025",
    priceEth: 0.1,
    priceMatic: 150,
    priceAvax: 2,
    network: "ethereum",
  },
  {
    id: "2",
    title: "Polygon Gaming Summit",
    banner: "/placeholder.svg?height=300&width=500",
    organizer: "Metaverse Guild",
    date: "Nov 10, 2025",
    priceEth: 0.05,
    priceMatic: 75,
    priceAvax: 1,
    network: "polygon",
  },
  {
    id: "3",
    title: "Avalanche DeFi Day",
    banner: "/placeholder.svg?height=300&width=500",
    organizer: "Snowflake Labs",
    date: "Dec 5, 2025",
    priceEth: 0.08,
    priceMatic: 120,
    priceAvax: 1.5,
    network: "avalanche",
  },
  {
    id: "4",
    title: "NFT Art Basel",
    banner: "/placeholder.svg?height=300&width=500",
    organizer: "Crypto Creatives",
    date: "Jan 15, 2026",
    priceEth: 0.2,
    priceMatic: 300,
    priceAvax: 4,
    network: "ethereum",
  },
]

export default function EventList() {
  const getPriceForChain = (event: Event) => {
    return (
      <div className="text-sm text-muted-foreground">
        <span className="font-semibold text-foreground">{event.priceEth} ETH</span> |{" "}
        <span className="font-semibold text-foreground">{event.priceMatic} MATIC</span> |{" "}
        <span className="font-semibold text-foreground">{event.priceAvax} AVAX</span>
      </div>
    )
  }

  const handleBuyClick = (eventName: string) => {
    console.log(`Redirecting to the page for "${eventName}"... (This is a placeholder action)`)
  }

  return (
    <section id="events" className="py-16 bg-background text-foreground">
      <div className="container mx-auto px-4">
        <motion.h2
          className="text-3xl md:text-4xl font-bold text-center mb-12 drop-shadow"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          Featured Events
        </motion.h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {mockEvents.map((event, index) => (
            <motion.div
              key={event.id}
              initial={{ opacity: 0, y: 60, scale: 0.8 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              whileHover={{ scale: 1.03, y: -5 }}
              transition={{
                duration: 0.7,
                delay: index * 0.15,
                ease: "easeOut",
              }}
              viewport={{ once: true, amount: 0.2 }}
            >
              <Card className="bg-card border-border text-foreground overflow-hidden h-full flex flex-col shadow-lg hover:shadow-xl transition-shadow duration-300">
                <div className="relative w-full h-48">
                  <Image
                    src={event.banner || "/placeholder.svg"}
                    alt={event.title}
                    layout="fill"
                    objectFit="cover"
                    className="rounded-t-lg"
                  />
                  <Badge
                    className={`absolute top-2 right-2 px-3 py-1 rounded-full text-xs font-semibold ${
                      event.network === "ethereum"
                        ? "bg-purple-600"
                        : event.network === "polygon"
                          ? "bg-blue-600"
                          : "bg-red-600"
                    }`}
                  >
                    {event.network.charAt(0).toUpperCase() + event.network.slice(1)}
                  </Badge>
                </div>
                <CardHeader className="flex-grow">
                  <CardTitle className="text-xl font-semibold mb-2">{event.title}</CardTitle>
                  <p className="text-sm text-muted-foreground mb-1">Organizer: {event.organizer}</p>
                  <p className="text-sm text-muted-foreground">Date: {event.date}</p>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="flex items-center justify-between">
                    <span className="text-lg font-bold">{getPriceForChain(event)}</span>
                  </div>
                </CardContent>
                <CardFooter>
                  <motion.div className="w-full" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                    <Button
                      className="w-full bg-primary hover:bg-primary/90 text-primary-foreground shadow-md hover:shadow-lg transition-all duration-300"
                      onClick={() => handleBuyClick(event.title)}
                    >
                      Buy Ticket
                    </Button>
                  </motion.div>
                </CardFooter>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
