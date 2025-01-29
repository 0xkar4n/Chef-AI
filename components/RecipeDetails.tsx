'use client'

import { useState, useRef, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ChefHat, Send, Clock } from 'lucide-react'
import axios from 'axios'

interface Recipe {
  id: Number
  title : string
  instructions: string[]
  prepTime: string
  cookTime: string
  cuisine: string
}

interface Message {
  role: 'user' | 'assistant'
  content: string
}

interface RecipeDetailsProps {
  recipe: Recipe
  recipeName: string
  onSendMessage: (message: string) => void
}

export function RecipeDetails({ recipe, recipeName, onSendMessage }: RecipeDetailsProps) {
  console.log("Recipe details page recipe",recipe)
  if (!recipe) {
    return <div>No recipe found for {recipeName}.</div>
  }

  const [conversation, setConversation] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(scrollToBottom, [conversation])


  useEffect(()=>{
    conversationData()
  },[recipe.id])

  const conversationData=async()=>{
      const res=await axios.get(`/api/chat-history/?recipeId=${recipe.id}`)
      console.log("Conversation data",res.data)
  }

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
        content: `I understand you're asking about "${input}" for the recipe "${recipeName}". As an AI assistant, I'm here to help with your cooking queries. Could you please provide more context or specify what you'd like to know about the recipe?`
      }
      setConversation(prev => [...prev, aiResponse])
      setLoading(false)
    }, 1000)
  }

  return (
    <div className="flex flex-col sm:flex-row h-full">
      <div className="w-full sm:w-1/2 p-4 sm:p-6 overflow-y-auto">
        <div className="mb-6">
          <h2 className="text-xl sm:text-2xl font-bold mb-4 text-gray-800">{recipeName}</h2>
          <div className="flex items-center mb-4">
            <Clock className="mr-2 text-primary" size={16} />
            <span className="text-xs sm:text-sm mr-4">Prep: {recipe.prepTime}</span>
            <Clock className="mr-2 text-primary" size={16} />
            <span className="text-xs sm:text-sm">Cook: {recipe.cookTime}</span>
          </div>
          <div className="flex flex-wrap gap-2 mb-4">
            {JSON.parse(recipe.cuisine).map((cuisine:string, index:number) => (
              <span key={index} className="px-2 py-1 text-xs font-medium bg-primary/10 text-primary rounded-full">
                {cuisine}
              </span>
            ))}
          </div>
          <h3 className="font-semibold text-base sm:text-lg mb-3 text-gray-700">Instructions:</h3>
          <ol className="list-decimal list-inside space-y-2 text-sm sm:text-base">
            {recipe.instructions.map((step, index) => (
              <p key={index} className="text-gray-600">{step}</p>
            ))}
          </ol>
        </div>
      </div>
      <div className="w-full sm:w-1/2 flex flex-col border-t sm:border-l border-gray-200">
        <div className="flex-grow overflow-y-auto p-4 sm:p-6 bg-gray-50">
          {conversation.map((message, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className={`mb-4 ${message.role === 'user' ? 'text-right' : 'text-left'}`}
            >
              <div
                className={`inline-block p-3 sm:p-4 rounded-lg max-w-[80%] ${
                  message.role === 'user'
                    ? 'bg-primary text-white'
                    : 'bg-white text-gray-800 shadow'
                }`}
              >
                {message.content.split('\n').map((line, i) => (
                  <p key={i} className="mb-1 last:mb-0 text-sm sm:text-base">{line}</p>
                ))}
              </div>
            </motion.div>
          ))}
          <div ref={messagesEndRef} />
        </div>
        <form onSubmit={handleSubmit} className="p-4 bg-white border-t border-gray-200">
          <div className="flex items-center">
            <Input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about the recipe..."
              className="flex-grow mr-3 text-sm sm:text-base"
            />
            <Button type="submit" disabled={!input.trim() || loading} className="bg-primary hover:bg-primary/90">
              <Send className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">Send</span>
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}

