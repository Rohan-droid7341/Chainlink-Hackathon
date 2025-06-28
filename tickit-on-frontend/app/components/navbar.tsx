"use client"

import Link from "next/link"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { motion, AnimatePresence } from "framer-motion"
import { Menu, X, Ticket } from "lucide-react"
import { ThemeToggle } from "./theme-toggle"

const navItems = [
  { name: "Home", href: "#" },
  { name: "Events", href: "#events" },
  { name: "How It Works", href: "#how-it-works" },
  { name: "Resale", href: "#resale-mechanics" },
  { name: "About", href: "#about" },
]

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)

  const toggleMenu = () => setIsOpen(!isOpen)

  return (
    <motion.nav
      className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border"
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <motion.div
            initial={{ scale: 1 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            transition={{ duration: 0.2 }}
          >
            <Link href="#" className="flex items-center space-x-2 text-foreground hover:text-primary transition-colors">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
              >
                <Ticket className="w-8 h-8 text-primary" />
              </motion.div>
              <span className="text-xl font-bold">TickIt</span>
            </Link>
          </motion.div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item, index) => (
              <motion.div
                key={item.name}
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                whileHover={{ y: -2 }}
                transition={{
                  delay: index * 0.1 + 0.3,
                  duration: 0.4,
                  type: "spring",
                  stiffness: 300,
                }}
              >
                <Link
                  href={item.href}
                  className="text-muted-foreground hover:text-primary transition-colors duration-200 font-medium relative group"
                >
                  {item.name}
                  <motion.div className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary group-hover:w-full transition-all duration-300" />
                </Link>
              </motion.div>
            ))}
          </div>

          {/* Desktop CTA and Theme Toggle */}
          <div className="hidden md:flex items-center space-x-4">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              transition={{ delay: 0.8, duration: 0.4 }}
            >
              <Button
                asChild
                variant="outline"
                className="bg-secondary text-secondary-foreground border-border hover:bg-secondary/80"
              >
                <Link href="#host">Host Event</Link>
              </Button>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              transition={{ delay: 0.9, duration: 0.4 }}
            >
              <Button asChild className="bg-primary text-primary-foreground hover:bg-primary/90">
                <Link href="#dashboard">Dashboard</Link>
              </Button>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 1, duration: 0.4 }}
            >
              <ThemeToggle />
            </motion.div>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center space-x-2">
            <ThemeToggle />
            <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
              <Button variant="ghost" size="icon" onClick={toggleMenu} className="text-foreground">
                <motion.div animate={{ rotate: isOpen ? 180 : 0 }} transition={{ duration: 0.3 }}>
                  {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                </motion.div>
              </Button>
            </motion.div>
          </div>
        </div>

        {/* Mobile Navigation */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="md:hidden overflow-hidden bg-card border-t border-border"
            >
              <div className="py-4 space-y-4">
                {navItems.map((item, index) => (
                  <motion.div
                    key={item.name}
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    whileHover={{ x: 10 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Link
                      href={item.href}
                      className="block px-4 py-2 text-muted-foreground hover:text-primary hover:bg-accent rounded-md transition-colors duration-200"
                      onClick={() => setIsOpen(false)}
                    >
                      {item.name}
                    </Link>
                  </motion.div>
                ))}
                <div className="px-4 pt-4 space-y-2 border-t border-border">
                  <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                    <Button
                      asChild
                      variant="outline"
                      className="w-full bg-secondary text-secondary-foreground border-border hover:bg-secondary/80"
                    >
                      <Link href="#host" onClick={() => setIsOpen(false)}>
                        Host Event
                      </Link>
                    </Button>
                  </motion.div>

                  <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                    <Button asChild className="w-full bg-primary text-primary-foreground hover:bg-primary/90">
                      <Link href="#dashboard" onClick={() => setIsOpen(false)}>
                        Dashboard
                      </Link>
                    </Button>
                  </motion.div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.nav>
  )
}


// app/components/Navbar.jsx
// import Link from "next/link";
// import { ConnectButton } from "./ConnectButton";

// export function Navbar() {
//   return (
//     <nav className="bg-gray-800/50 backdrop-blur-sm border-b border-gray-700 sticky top-0 z-50">
//       <div className="container mx-auto px-4">
//         <div className="flex justify-between items-center py-4">
//           <Link href="/" className="text-2xl font-bold text-white">
//             TickIt<span className="text-blue-500">On</span>
//           </Link>
//           <div className="hidden md:flex items-center space-x-6 text-lg">
//             <Link href="/events" className="hover:text-blue-400 transition-colors">Marketplace</Link>
//             <Link href="/create-event" className="hover:text-blue-400 transition-colors">Create Event</Link>
//             <Link href="/profile" className="hover:text-blue-400 transition-colors">My Profile</Link>
//           </div>
//           <ConnectButton />
//         </div>
//       </div>
//     </nav>
//   );
// }