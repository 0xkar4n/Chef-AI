'use client'

import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ChefHat, Send } from 'lucide-react'

interface Message {
  role: 'user' | 'assistant'
  content: string
}

interface RecipeChatProps {
  conversation: Message[]
  recipeId: string
  onSendMessage: (message: string) => void
}

export function RecipeChat({ conversation: initialConversation, recipeId, onSendMessage }: RecipeChatProps) {
  const [conversation, setConversation] = useState<Message[]>(initialConversation)
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(scrollToBottom, [conversation])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || loading) return

    const newMessage: Message = { role: 'user', content: input }
    setConversation([...conversation, newMessage])
    setInput('')
    setLoading(true)

    onSendMessage(input)

    // Simulate API call for AI response
    setTimeout(() => {
      const aiResponse: Message = {
        role: 'assistant',
        content: `I understand you're asking about "${input}". As an AI assistant, I'm here to help with your cooking queries. Could you please provide more context or specify what you'd like to know about the recipe?`
      }
      setConversation(prev => [...prev, aiResponse])
      setLoading(false)
    }, 1000)
  }

  return (
    <div className="flex flex-col h-full">
      <div className="bg-primary p-4 text-white flex items-center justify-between">
        <div className="flex items-center">
          <ChefHat className="mr-2" />
          <h1 className="text-xl font-bold">Chef AI Recipe Assistant</h1>
        </div>
        <span className="text-sm opacity-75">Recipe ID: {recipeId}</span>
      </div>
      <div className="flex-grow overflow-y-auto p-4">
        <AnimatePresence>
          {conversation.map((message, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className={`mb-4 ${message.role === 'user' ? 'text-right' : 'text-left'}`}
            >
              <div
                className={`inline-block p-3 rounded-lg ${
                  message.role === 'user'
                    ? 'bg-primary text-white'
                    : 'bg-gray-200 text-gray-800'
                }`}
              >
                {message.content.split('\n').map((line, i) => (
                  <p key={i}>{line}</p>
                ))}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
        <div ref={messagesEndRef} />
      </div>
      <form onSubmit={handleSubmit} className="p-4 border-t">
        <div className="flex items-center">
          <Input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about the recipe..."
            className="flex-grow mr-2"
          />
          <Button type="submit" disabled={!input.trim() || loading}>
            <Send className="h-4 w-4 mr-2" />
            Send
          </Button>
        </div>
      </form>
    </div>
  )
}

