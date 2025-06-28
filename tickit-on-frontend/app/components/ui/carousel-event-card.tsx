"use client"

import Image from "next/image"
import { motion } from "framer-motion"
import { Calendar, MapPin, Users, Star, Zap, Crown, Gem, TrendingUp, TrendingDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ShimmerBadge } from "@/components/ui/shimmer-badge"

interface CarouselEventCardProps {
  event: {
    id: string
    title: string
    banner: string
    organizer: string
    date: string
    location: string
    attendees: number
    priceEth: number
    category: string
    rating: number
    featured: boolean
    trend: "up" | "down" | "stable"
    description: string
  }
  onBuyClick: (eventName: string) => void
}

const categoryIcons = {
  Technology: Zap,
  Gaming: Star,
  Finance: Crown,
  Art: Gem,
}

const categoryColors = {
  Technology: "blue" as const,
  Gaming: "purple" as const,
  Finance: "green" as const,
  Art: "pink" as const,
}

export function CarouselEventCard({ event, onBuyClick }: CarouselEventCardProps) {
  const CategoryIcon = categoryIcons[event.category as keyof typeof categoryIcons]
  const categoryColor = categoryColors[event.category as keyof typeof categoryColors]
  const TrendIcon = event.trend === "up" ? TrendingUp : TrendingDown

  return (
    <div className="relative w-full h-[600px] rounded-2xl overflow-hidden group">
      {/* Background Image */}
      <div className="absolute inset-0">
        <Image
          src={event.banner || "/placeholder.svg"}
          alt={event.title}
          layout="fill"
          objectFit="cover"
          className="transition-transform duration-700 group-hover:scale-110"
        />
        {/* Gradient Overlays */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/20" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-transparent to-transparent" />
      </div>

      {/* Floating Elements */}
      <motion.div
        className="absolute top-6 left-6 z-20"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <ShimmerBadge color={categoryColor}>
          <CategoryIcon className="w-3 h-3 mr-1 inline" />
          {event.category}
        </ShimmerBadge>
      </motion.div>

      {event.featured && (
        <motion.div
          className="absolute top-6 right-6 z-20"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <ShimmerBadge color="orange">
            <Star className="w-3 h-3 mr-1 inline" />
            Featured
          </ShimmerBadge>
        </motion.div>
      )}

      {/* Price Display */}
      <motion.div
        className="absolute top-20 right-6 z-20"
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.4 }}
      >
        <div className="bg-black/30 backdrop-blur-md rounded-lg px-4 py-2 border border-white/20">
          <div className="flex items-center space-x-2">
            <span className="text-2xl font-bold text-white">{event.priceEth} ETH</span>
            {event.trend !== "stable" && (
              <TrendIcon className={`w-5 h-5 ${event.trend === "up" ? "text-green-400" : "text-red-400"}`} />
            )}
          </div>
          <p className="text-xs text-gray-300">Starting price</p>
        </div>
      </motion.div>

      {/* Main Content */}
      <div className="absolute inset-0 flex flex-col justify-end p-8 z-10">
        <motion.div
          className="space-y-4"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.6 }}
        >
          {/* Event Title */}
          <h2 className="text-4xl md:text-5xl font-bold text-white leading-tight">{event.title}</h2>

          {/* Event Description */}
          <p className="text-lg text-gray-200 max-w-2xl leading-relaxed">{event.description}</p>

          {/* Event Details */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
            <motion.div
              className="flex items-center space-x-3 bg-white/10 backdrop-blur-sm rounded-lg px-4 py-3"
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.2 }}
            >
              <Calendar className="w-5 h-5 text-blue-400" />
              <div>
                <p className="text-sm text-gray-300">Date</p>
                <p className="text-white font-semibold">{event.date}</p>
              </div>
            </motion.div>

            <motion.div
              className="flex items-center space-x-3 bg-white/10 backdrop-blur-sm rounded-lg px-4 py-3"
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.2 }}
            >
              <MapPin className="w-5 h-5 text-green-400" />
              <div>
                <p className="text-sm text-gray-300">Location</p>
                <p className="text-white font-semibold">{event.location}</p>
              </div>
            </motion.div>

            <motion.div
              className="flex items-center space-x-3 bg-white/10 backdrop-blur-sm rounded-lg px-4 py-3"
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.2 }}
            >
              <Users className="w-5 h-5 text-purple-400" />
              <div>
                <p className="text-sm text-gray-300">Attendees</p>
                <p className="text-white font-semibold">{event.attendees.toLocaleString()}</p>
              </div>
            </motion.div>
          </div>

          {/* Organizer and Rating */}
          <div className="flex items-center justify-between mt-6">
            <div>
              <p className="text-sm text-gray-300">Organized by</p>
              <p className="text-xl font-semibold text-white">{event.organizer}</p>
            </div>
            <div className="flex items-center space-x-2">
              <Star className="w-5 h-5 text-yellow-400 fill-current" />
              <span className="text-xl font-bold text-white">{event.rating}</span>
              <span className="text-gray-300">/5</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-4 mt-8">
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="flex-1">
              <Button
                size="lg"
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-2xl border-0 text-lg py-6"
                onClick={() => onBuyClick(event.title)}
              >
                <Zap className="w-5 h-5 mr-2" />
                Buy Ticket Now
              </Button>
            </motion.div>

            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                size="lg"
                variant="outline"
                className="bg-white/10 backdrop-blur-sm text-white border-white/30 hover:bg-white/20 py-6 px-8"
              >
                Learn More
              </Button>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
