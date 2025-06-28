import Navbar from "@/components/navbar"
import HeroSection from "@/components/hero-section"
import FeaturesGrid from "@/components/features-grid"
import EventList from "@/components/event-list"
import HowItWorks from "@/components/how-it-works"
import ResaleInfo from "@/components/resale-info"
import FooterSection from "@/components/footer-section"

export default function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <HeroSection />
      <FeaturesGrid />
      <EventList />
      <HowItWorks />
      <ResaleInfo />
      <FooterSection />
    </div>
  )
}

// app/page.jsx
// import Link from 'next/link';

// export default function HomePage() {
//   return (
//     <div className="text-center flex flex-col items-center justify-center h-[70vh]">
//       <h1 className="text-6xl font-extrabold tracking-tight text-white sm:text-8xl">
//         The Future of Ticketing is <span className="text-blue-500">Cross-Chain</span>.
//       </h1>
//       <p className="mt-6 max-w-2xl text-xl text-gray-300">
//         Experience seamless, secure, and dynamic event ticketing powered by Chainlink CCIP. Buy and sell tickets across any blockchain.
//       </p>
//       <div className="mt-10 flex gap-4">
//         <Link href="/events"
//           className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-lg text-lg transition-transform hover:scale-105">
//           Explore Events
//         </Link>
//         <Link href="/create-event"
//           className="bg-gray-700 hover:bg-gray-600 text-white font-bold py-3 px-8 rounded-lg text-lg transition-transform hover:scale-105">
//           Become an Organizer
//         </Link>
//       </div>
//     </div>
//   );
// }