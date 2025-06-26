import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
})

export const metadata: Metadata = {
  title: "Cued - Your AI Scene Partner | Practice Acting with AI",
  description:
    "Practice scenes, develop characters, and perfect your craft with Cued - the AI-powered rehearsal partner for actors and performers.",
  keywords: "AI acting coach, scene partner, actor rehearsal, AI for actors, acting practice, audition prep",
  authors: [{ name: "Cued Team" }],
  creator: "Cued",
  openGraph: {
    title: "Cued - Your AI Scene Partner",
    description: "Get cast with your 24/7 AI rehearsal partner. Revolutionary AI for actors and performers.",
    url: "https://getcued.ai",
    siteName: "Cued",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Cued - Your AI Scene Partner",
    description: "Get cast with your 24/7 AI rehearsal partner. Revolutionary AI for actors and performers.",
    creator: "@getcued",
  },
  robots: {
    index: true,
    follow: true,
  },
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning className={inter.variable}>
      <body className={`${inter.className} text-rendering-optimized`}>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false} disableTransitionOnChange>
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}
