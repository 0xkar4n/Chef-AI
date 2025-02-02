'use client'

import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ChefHat, Send } from 'lucide-react'
import axios from 'axios'

interface Message {
  id: number
  message: string
  isUser: boolean
  createdAt: Date
}

interface RecipeChatProps {
  recipeId: string
  onSendMessage?: (message: string) => void
}

export function RecipeChat({ recipeId }: RecipeChatProps) {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  // Fetch chat history when component mounts
  useEffect(() => {
    const fetchChatHistory = async () => {
      try {
        const response = await axios.get(`/api/recipe-chat?recipeId=${recipeId}`)
        console.log('Chat History:', response.data)
        setMessages(response.data)
      } catch (error) {
        console.error('Error fetching chat history:', error)
      }
    }

    if (recipeId) {
      fetchChatHistory()
    }
  }, [recipeId])

  useEffect(scrollToBottom, [messages])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || loading) return

    setLoading(true)
    try {
      // Send message to backend
      const response = await axios.post('/api/recipe-chat', {
        message: input,
        recipeId: recipeId
      })

      console.log('New message response:', response.data)
      
      // Add new messages to the chat
      setMessages(prev => [...prev, ...response.data])
      setInput('')
    } catch (error) {
      console.error('Error sending message:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex flex-col h-[calc(100vh-12rem)]">
      <div className="bg-primary p-4 text-white flex items-center justify-between">
        <div className="flex items-center">
          <ChefHat className="mr-2" />
          <h1 className="text-xl font-bold">Chef AI Recipe Assistant</h1>
        </div>
        <span className="text-sm opacity-75">Recipe ID: {recipeId}</span>
      </div>
      <div className="flex-1 overflow-y-auto p-4 pb-18">
        <AnimatePresence>
          {messages.map((message, index) => (
            <motion.div
              key={message.id || index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className={`flex ${message.isUser ? 'justify-end' : 'justify-start'} mb-4`}
            >
              <div
                className={`max-w-[80%] rounded-lg p-3 ${
                  message.isUser
                    ? 'bg-primary text-white'
                    : 'bg-gray-100 text-gray-800'
                }`}
              >
                {message.message.split('\n').map((line, i) => (
                  <p key={i} className="whitespace-pre-wrap">{line}</p>
                ))}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
        <div ref={messagesEndRef} />
      </div>
      <div className="sticky bottom-0 left-0 right-0 bg-white border-t py-4 px-4">
        <form onSubmit={handleSubmit}>
          <div className="flex items-center gap-2 max-w-full">
            <Input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about the recipe..."
              className="flex-1"
              disabled={loading}
            />
            <Button 
              type="submit" 
              disabled={!input.trim() || loading}
              className="shrink-0"
            >
              {loading ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
              ) : (
                <Send className="h-4 w-4 mr-2" />
              )}
              Send
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}

