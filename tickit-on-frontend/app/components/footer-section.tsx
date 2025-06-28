"use client"

import Link from "next/link"
import { Twitter, DiscIcon as Discord, Github } from "lucide-react"

export default function FooterSection() {
  return (
    <footer className="bg-card text-muted-foreground py-8 border-t border-border">
      <div className="mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="flex flex-col items-center md:items-start">
          <p className="text-lg font-bold text-foreground mb-2">Cross-Chain NFT Tickets</p>
          <nav className="flex flex-wrap justify-center md:justify-start gap-x-6 gap-y-2 text-sm">
            <Link href="#" className="hover:text-primary transition-colors">
              About
            </Link>
            <Link href="#" className="hover:text-primary transition-colors">
              Documentation
            </Link>
            <Link href="#" className="hover:text-primary transition-colors">
              Terms & Privacy
            </Link>
          </nav>
        </div>

        <div className="flex gap-4">
          <Link href="#" aria-label="Twitter" className="hover:text-primary transition-colors">
            <Twitter className="w-6 h-6" />
          </Link>
          <Link href="#" aria-label="Discord" className="hover:text-primary transition-colors">
            <Discord className="w-6 h-6" />
          </Link>
          <Link href="#" aria-label="GitHub" className="hover:text-primary transition-colors">
            <Github className="w-6 h-6" />
          </Link>
        </div>

        <div className="text-sm text-center md:text-right">
          <p>Wallet not connected</p>
          <p className="mt-2">&copy; {new Date().getFullYear()} Cross-Chain NFT Tickets. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
