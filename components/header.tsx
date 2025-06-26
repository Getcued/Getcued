"use client"

import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Twitter, Instagram } from "lucide-react"

// Custom TikTok icon since Lucide doesn't have it
const TikTokIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
  </svg>
)

export function Header() {
  return (
    <motion.header
      className="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-md border-b border-gray-800/50"
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <div className="container mx-auto px-4 py-4 flex items-center justify-between pr-16 lg:pr-4">
        <motion.div
          className="text-2xl font-bold bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent"
          whileHover={{ scale: 1.05 }}
        >
          Cued
        </motion.div>

        <div className="flex items-center space-x-6">
          <div className="hidden md:flex items-center space-x-6">
            <a href="/rehearsal" className="text-gray-300 hover:text-pink-400 transition-colors font-medium">
              Line Rehearsal
            </a>
            <div className="flex items-center space-x-4">
              <a
                href="https://x.com/getcuedai"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-300 hover:text-blue-400 transition-colors"
                aria-label="Follow Cued on X (Twitter)"
              >
                <Twitter className="w-5 h-5" />
              </a>
              <a
                href="https://www.instagram.com/getcued"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-300 hover:text-pink-400 transition-colors"
                aria-label="Follow Cued on Instagram"
              >
                <Instagram className="w-5 h-5" />
              </a>
              <a
                href="https://www.tiktok.com/@get.cued"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-300 hover:text-white transition-colors"
                aria-label="Follow Cued on TikTok"
              >
                <TikTokIcon className="w-5 h-5" />
              </a>
            </div>
          </div>
          <Button variant="outline" className="border-pink-500/50 text-pink-400 hover:bg-pink-500/10">
            New Scene
          </Button>
        </div>
      </div>
    </motion.header>
  )
}
