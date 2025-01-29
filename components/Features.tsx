'use client'

import { motion } from 'framer-motion'
import { Clock, Utensils, Sparkles, ShoppingCart } from 'lucide-react'

const features = [
  {
    icon: <Clock className="h-6 w-6" />,
    title: "Time-Saving Recipes",
    description: "Get quick and easy recipes based on your available ingredients."
  },
  {
    icon: <Utensils className="h-6 w-6" />,
    title: "Personalized Suggestions",
    description: "Receive tailored recipe recommendations that match your preferences."
  },
  {
    icon: <Sparkles className="h-6 w-6" />,
    title: "AI-Powered Creativity",
    description: "Discover unique recipe combinations you might never have thought of."
  },
 
]

export function Features() {
  return (
    <section className="relative py-12 sm:py-16 md:py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-secondary/5 to-primary/5 overflow-hidden">
      <div className="max-w-5xl mx-auto relative z-10">
        <h2 className="text-2xl sm:text-3xl font-bold mb-8 sm:mb-12 text-center text-gray-800">Why Choose Chef AI?</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {features.map((feature, index) => (
            <motion.div 
              key={index}
              className="backdrop-blur-lg bg-white/70 p-6 rounded-lg shadow-lg border border-primary/20"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <div className="text-accent mb-4">{feature.icon}</div>
              <h3 className="text-lg sm:text-xl font-semibold mb-2 text-gray-800">{feature.title}</h3>
              <p className="text-sm sm:text-base text-gray-600">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

