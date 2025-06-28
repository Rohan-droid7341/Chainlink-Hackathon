// app/layout.jsx

// No longer need headers or cookieToInitialState here
import { Navbar } from "./components/Navbar";
import { Providers } from './providers';
import "./globals.css";

// The layout is a pure Server Component
export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-gray-900 text-white font-sans">
        {/*
          We no longer pass initialState.
          The `Providers` component now handles everything.
        */}
        <Providers>
          <div className="min-h-screen flex flex-col">
            <Navbar />
            <main className="flex-grow container mx-auto px-4 py-8">
              {children}
            </main>
            <footer className="text-center p-4 text-gray-500 border-t border-gray-700">
              Powered by Chainlink CCIP & TickItOn
            </footer>
          </div>
        </Providers>
      </body>
    </html>
  );
}