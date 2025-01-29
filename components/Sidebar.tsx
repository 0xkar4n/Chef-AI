'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface Prompt {
  id: string
  content: string
  timestamp: string
}

export function Sidebar({ prompts, onPromptSelect }: { prompts: Prompt[], onPromptSelect: (prompt: string) => void }) {
  const [isOpen, setIsOpen] = useState(false)

  const toggleSidebar = () => setIsOpen(!isOpen)

  return (
    <motion.div
      className="fixed left-0 top-0 h-full bg-white dark:bg-zinc-800 shadow-lg z-10"
      initial={{ width: isOpen ? 300 : 50 }}
      animate={{ width: isOpen ? 300 : 50 }}
      transition={{ duration: 0.3 }}
    >
      <Button
        variant="ghost"
        size="icon"
        className="absolute right-2 top-2"
        onClick={toggleSidebar}
      >
        {isOpen ? <ChevronLeft /> : <ChevronRight />}
      </Button>
      {isOpen && (
        <div className="p-4 mt-12 h-full overflow-y-auto">
          <h2 className="text-xl font-bold mb-4">Previous Prompts</h2>
          {prompts.map((prompt) => (
            <motion.div
              key={prompt.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="mb-4 p-3 bg-gray-100 dark:bg-zinc-700 rounded-lg cursor-pointer hover:bg-gray-200 dark:hover:bg-zinc-600 transition-colors"
              onClick={() => onPromptSelect(prompt.content)}
            >
              <p className="text-sm">{prompt.content}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{prompt.timestamp}</p>
            </motion.div>
          ))}
        </div>
      )}
    </motion.div>
  )
}

