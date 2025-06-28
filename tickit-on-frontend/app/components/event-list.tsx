"use client"

import { motion } from "framer-motion"
import { EnhancedCarousel } from "@/components/ui/enhanced-carousel"
import { CarouselEventCard } from "@/components/ui/carousel-event-card"
import { FloatingOrb } from "@/components/ui/floating-orb"
import { TextReveal } from "@/components/ui/text-reveal"

// Enhanced mock data with dummy image links and descriptions
const mockEvents = [
  {
    id: "1",
    title: "Decentralized DevCon 2025",
    banner: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&h=600&fit=crop",
    organizer: "Web3 Builders DAO",
    date: "Oct 26, 2025",
    location: "San Francisco, CA",
    attendees: 2500,
    priceEth: 0.1,
    category: "Technology",
    rating: 4.9,
    featured: true,
    trend: "up" as const,
    description:
      "Join the most innovative minds in blockchain technology for three days of cutting-edge presentations, workshops, and networking opportunities that will shape the future of decentralized applications.",
  },
  {
    id: "2",
    title: "Polygon Gaming Summit",
    banner: "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800&h=600&fit=crop",
    organizer: "Metaverse Guild",
    date: "Nov 10, 2025",
    location: "Austin, TX",
    attendees: 1800,
    priceEth: 0.05,
    category: "Gaming",
    rating: 4.7,
    featured: false,
    trend: "stable" as const,
    description:
      "Explore the intersection of gaming and blockchain technology. Discover how NFTs, play-to-earn mechanics, and decentralized gaming economies are revolutionizing the gaming industry.",
  },
  {
    id: "3",
    title: "Avalanche DeFi Day",
    banner: "https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=800&h=600&fit=crop",
    organizer: "Snowflake Labs",
    date: "Dec 5, 2025",
    location: "New York, NY",
    attendees: 3200,
    priceEth: 0.08,
    category: "Finance",
    rating: 4.8,
    featured: true,
    trend: "up" as const,
    description:
      "Dive deep into the world of decentralized finance on Avalanche. Learn about yield farming, liquidity mining, and the latest DeFi protocols that are changing traditional finance.",
  },
  {
    id: "4",
    title: "NFT Art Basel",
    banner: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop",
    organizer: "Crypto Creatives",
    date: "Jan 15, 2026",
    location: "Miami, FL",
    attendees: 5000,
    priceEth: 0.2,
    category: "Art",
    rating: 4.9,
    featured: true,
    trend: "down" as const,
    description:
      "Experience the convergence of traditional art and digital innovation. Witness groundbreaking NFT exhibitions, meet renowned digital artists, and explore the future of art ownership.",
  },
  {
    id: "5",
    title: "Web3 Security Conference",
    banner: "https://images.unsplash.com/photo-1626338495392-75343d5aa00e?w=800&h=600&fit=crop",
    organizer: "CyberSafe Alliance",
    date: "Feb 20, 2026",
    location: "London, UK",
    attendees: 1500,
    priceEth: 0.12,
    category: "Technology",
    rating: 4.6,
    featured: false,
    trend: "up" as const,
    description:
      "Learn from top security experts about protecting blockchain applications, smart contract auditing, and the latest cybersecurity threats in the Web3 ecosystem.",
  },
  {
    id: "6",
    title: "Metaverse Fashion Week",
    banner: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&h=600&fit=crop",
    organizer: "Digital Fashion House",
    date: "Mar 12, 2026",
    location: "Paris, France",
    attendees: 4200,
    priceEth: 0.15,
    category: "Art",
    rating: 4.8,
    featured: true,
    trend: "stable" as const,
    description:
      "Step into the future of fashion where digital meets physical. Explore virtual runways, NFT wearables, and the revolutionary impact of blockchain on the fashion industry.",
  },
]

export default function EventList() {
  const handleBuyClick = (eventName: string) => {
    console.log(`Redirecting to the page for "${eventName}"... (This is a placeholder action)`)
  }

  const carouselItems = mockEvents.map((event) => ({
    id: event.id,
    content: <CarouselEventCard event={event} onBuyClick={handleBuyClick} />,
  }))

  return (
    <section id="events" className="py-16 bg-background text-foreground relative overflow-hidden">
      {/* Floating orbs for ambiance */}
      <FloatingOrb size="lg" color="blue" className="top-20 left-10 opacity-20" />
      <FloatingOrb size="md" color="purple" className="top-40 right-20 opacity-15" />
      <FloatingOrb size="sm" color="pink" className="bottom-20 left-1/4 opacity-25" />

      <div className="container mx-auto px-4">
        <TextReveal>
          <motion.h2
            className="text-3xl md:text-4xl font-bold text-center mb-4 drop-shadow bg-gradient-to-r from-white via-blue-200 to-purple-300 bg-clip-text text-transparent"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            Featured Events
          </motion.h2>
        </TextReveal>

        <TextReveal delay={0.2}>
          <p className="text-center text-muted-foreground mb-12 text-lg">
            Discover amazing events across multiple blockchain networks
          </p>
        </TextReveal>

        {/* Enhanced Carousel */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          viewport={{ once: true }}
          className="relative"
        >
          <EnhancedCarousel
            items={carouselItems}
            autoPlay={true}
            autoPlayInterval={6000}
            showDots={true}
            showArrows={true}
            className="h-[600px] rounded-2xl overflow-hidden shadow-2xl"
          />
        </motion.div>

        {/* Additional Info */}
        <TextReveal delay={0.5}>
          <div className="mt-12 text-center">
            <p className="text-muted-foreground mb-4">Swipe or use arrows to explore more events</p>
            <motion.div
              className="flex justify-center space-x-4"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ delay: 0.7 }}
            >
              <div className="bg-white/10 backdrop-blur-sm rounded-lg px-4 py-2">
                <span className="text-sm text-muted-foreground">Total Events: </span>
                <span className="font-bold text-foreground">{mockEvents.length}</span>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-lg px-4 py-2">
                <span className="text-sm text-muted-foreground">Featured: </span>
                <span className="font-bold text-foreground">{mockEvents.filter((e) => e.featured).length}</span>
              </div>
            </motion.div>
          </div>
        </TextReveal>
      </div>
    </section>
  )
}
