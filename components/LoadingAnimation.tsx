'use client'

import { motion } from 'framer-motion'
import { Utensils, Clock, Search } from 'lucide-react'

export  function LoadingAnimation() {
  return (
    <div className="flex justify-center items-center space-x-4">
      <motion.div
        animate={{
          rotate: [0, 360],
          scale: [1, 1.2, 1],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      >
        <Utensils className="h-8 w-8 text-primary" />
      </motion.div>
      <motion.div
        animate={{
          rotate: [0, 360],
          scale: [1, 1.2, 1],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 0.5,
        }}
      >
        <Clock className="h-8 w-8 text-secondary" />
      </motion.div>
      <motion.div
        animate={{
          rotate: [0, 360],
          scale: [1, 1.2, 1],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 1,
        }}
      >
        <Search className="h-8 w-8 text-accent" />
      </motion.div>
    </div>
  )
}

