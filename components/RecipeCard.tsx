'use client'

import { motion } from 'framer-motion'
import { Clock } from 'lucide-react'

interface RecipeCardProps {
  name: string
  prepTime: string
  cookTime: string
  cuisine: string
  onClick: () => void
}

export function RecipeCard({ name, prepTime, cookTime, cuisine, onClick }: RecipeCardProps) {

 //console.log( name, prepTime, cookTime, cuisine)
  return (
    <motion.div
      className="bg-white rounded-xl shadow-lg overflow-hidden cursor-pointer hover:shadow-xl transition-all duration-300 border border-gray-100 h-[180px] sm:h-[200px] flex flex-col justify-between"
      whileHover={{ scale: 1.03, y: -5 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
    >
      <div className="p-3 sm:p-4">
        <h3 className="text-base sm:text-lg font-semibold mb-2 text-gray-800 line-clamp-2">{name}</h3>
        <div className="flex items-center text-xs sm:text-sm text-gray-600 mb-2">
          <Clock className="w-3 h-3 sm:w-4 sm:h-4 mr-1 text-primary" />
          <span>{prepTime} prep</span>
          <span className="mx-2">•</span>
          <Clock className="w-3 h-3 sm:w-4 sm:h-4 mr-1 text-primary" />
          <span>{cookTime} cook</span>
        </div>
      </div>
      <div className="p-3 sm:p-4 bg-gray-50">
        <div className="flex flex-wrap gap-1 sm:gap-2">
          {cuisine && JSON.parse(cuisine).map((tag:string, index:number) => (
            <span
              key={index}
              className="px-2 py-1 text-xs font-medium bg-primary/10 text-primary rounded-full"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
    </motion.div>
  )
}

