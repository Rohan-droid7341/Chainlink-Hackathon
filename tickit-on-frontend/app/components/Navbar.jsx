// app/components/Navbar.jsx
import Link from "next/link";
import { ConnectButton } from "./ConnectButton";

export function Navbar() {
  return (
    <nav className="bg-gray-800/50 backdrop-blur-sm border-b border-gray-700 sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          <Link href="/" className="text-2xl font-bold text-white">
            TickIt<span className="text-blue-500">On</span>
          </Link>
          <div className="hidden md:flex items-center space-x-6 text-lg">
            <Link href="/events" className="hover:text-blue-400 transition-colors">Marketplace</Link>
            <Link href="/create-event" className="hover:text-blue-400 transition-colors">Create Event</Link>
            <Link href="/profile" className="hover:text-blue-400 transition-colors">My Profile</Link>
          </div>
          <ConnectButton />
        </div>
      </div>
    </nav>
  );
}