'use client'

import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Menu } from 'lucide-react'
import { useState } from 'react'
import Link from 'next/link'

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <motion.header 
      className="py-4 px-4 sm:px-6 lg:px-8 backdrop-blur-md bg-white/70 shadow-sm fixed w-full z-50"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="max-w-5xl mx-auto flex justify-between items-center">
        <Link href="/" className="text-xl sm:text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-primary via-accent to-secondary">
          Chef AI
        </Link>
        <nav className="hidden sm:block">
          <Link href="/login" passHref>
            <Button variant="ghost" className="text-gray-800 hover:text-primary">Login</Button>
          </Link>
          <Link href="/signup" passHref>
            <Button className="ml-4 bg-primary hover:bg-primary/90 text-white">Sign Up</Button>
          </Link>
        </nav>
        <div className="sm:hidden">
          <Button variant="ghost" size="icon" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            <Menu className="h-6 w-6" />
          </Button>
        </div>
      </div>
      {isMenuOpen && (
        <motion.div 
          className="sm:hidden mt-4 py-4 border-t border-gray-200"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
        >
          <Link href="/login" passHref>
            <Button variant="ghost" className="w-full text-gray-800 hover:text-primary mb-2">Login</Button>
          </Link>
          <Link href="/signup" passHref>
            <Button className="w-full bg-primary hover:bg-primary/90 text-white">Sign Up</Button>
          </Link>
        </motion.div>
      )}
    </motion.header>
  )
}

