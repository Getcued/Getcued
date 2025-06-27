"use client"

import Link from "next/link"

export default function Header() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-sm border-b border-gray-800">
      <div className="max-w-6xl mx-auto px-4 py-4">
        <Link href="/" className="text-2xl font-bold text-white hover:text-pink-400 transition-colors">
          Cued
        </Link>
      </div>
    </header>
  )
}
