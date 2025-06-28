import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
// Removed Toaster import

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Cross-Chain NFT Tickets",
  description: "A decentralized event ticketing platform.",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange>
          {children}
          {/* Removed Toaster component */}
        </ThemeProvider>
      </body>
    </html>
  )
}


























// app/layout.jsx

// No longer need headers or cookieToInitialState here
// import { Navbar } from "./components/Navbar";
// import { Providers } from './providers';
// import "./globals.css";

// The layout is a pure Server Component
// export default function RootLayout({ children }) {
//   return (
//     <html lang="en">
//       <body className="bg-gray-900 text-white font-sans">
//         {/*
//           We no longer pass initialState.
//           The `Providers` component now handles everything.
//         */}
//         <Providers>
//           <div className="min-h-screen flex flex-col">
//             <Navbar />
//             <main className="flex-grow container mx-auto px-4 py-8">
//               {children}
//             </main>
//             <footer className="text-center p-4 text-gray-500 border-t border-gray-700">
//               Powered by Chainlink CCIP & TickItOn
//             </footer>
//           </div>
//         </Providers>
//       </body>
//     </html>
//   );
// }