'use client'

import { motion } from 'framer-motion'
import { Salad, Coffee, Pizza, Cake } from 'lucide-react'

const categories = [
  { name: 'Healthy', icon: <Salad className="h-6 w-6 sm:h-8 sm:w-8" /> },
  { name: 'Breakfast', icon: <Coffee className="h-6 w-6 sm:h-8 sm:w-8" /> },
  { name: 'Main Course', icon: <Pizza className="h-6 w-6 sm:h-8 sm:w-8" /> },
  { name: 'Desserts', icon: <Cake className="h-6 w-6 sm:h-8 sm:w-8" /> },
]

export function RecipeCategories() {
  return (
    <section className="py-12 sm:py-16 md:py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        <h2 className="text-2xl sm:text-3xl font-bold mb-8 sm:mb-12 text-center text-gray-800">Explore Recipe Categories</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-8">
          {categories.map((category, index) => (
            <motion.div
              key={category.name}
              className="flex flex-col items-center p-4 sm:p-6 bg-white/70 backdrop-blur-sm rounded-lg shadow-md border border-primary/20 cursor-pointer hover:bg-primary/10 transition-colors"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <div className="text-primary mb-2 sm:mb-4">{category.icon}</div>
              <h3 className="text-sm sm:text-lg font-semibold text-gray-800 text-center">{category.name}</h3>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

