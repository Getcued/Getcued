"use client"

import { motion } from "framer-motion"
import { Star, Quote } from "lucide-react"

const testimonials = [
  {
    name: "Sarah Chen",
    role: "Broadway Performer",
    content:
      "Finally, a scene partner that's always available and never judges. This is going to revolutionize how we rehearse.",
    rating: 5,
  },
  {
    name: "Marcus Rodriguez",
    role: "Film Actor",
    content:
      "The AI understands context and emotion in ways I never expected. It's like having a seasoned acting coach available 24/7.",
    rating: 5,
  },
  {
    name: "Emma Thompson",
    role: "Theater Director",
    content: "I can't wait to recommend this to all my students. The future of acting practice is here.",
    rating: 5,
  },
]

export function TestimonialsSection() {
  return (
    <motion.section
      className="w-full max-w-6xl mx-auto px-4 py-20"
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 2.5 }}
    >
      <div className="text-center mb-16">
        <motion.h3
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 2.7 }}
          className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-pink-400 via-orange-400 to-purple-400 bg-clip-text text-transparent mb-4"
        >
          Loved by Performers
        </motion.h3>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 2.9 }}
          className="text-gray-300 text-lg max-w-2xl mx-auto"
        >
          See what industry professionals are saying about the future of rehearsal
        </motion.p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {testimonials.map((testimonial, index) => (
          <motion.div
            key={testimonial.name}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 3.1 + index * 0.2 }}
            className="bg-gray-900/50 backdrop-blur-sm border border-gray-800/50 rounded-lg p-6 space-y-4 hover:border-pink-500/30 transition-colors duration-300"
          >
            <Quote className="w-8 h-8 text-pink-400 opacity-60" />
            <p className="text-gray-300 leading-relaxed">"{testimonial.content}"</p>
            <div className="flex items-center space-x-1 mb-4">
              {[...Array(testimonial.rating)].map((_, i) => (
                <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
              ))}
            </div>
            <div>
              <p className="text-white font-semibold">{testimonial.name}</p>
              <p className="text-gray-400 text-sm">{testimonial.role}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.section>
  )
}
