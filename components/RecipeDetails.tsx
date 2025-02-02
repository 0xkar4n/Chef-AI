'use client'

import { useState, useRef, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ChefHat, Send, Clock } from 'lucide-react'
import axios from 'axios'
import { RecipeChat } from './RecipeChat'

interface Recipe {
  id: Number
  title: string
  instructions: string[]
  prepTime: string
  cookTime: string
  cuisine: string
}

export interface RecipeDetailsProps {
  recipe: Recipe
  recipeName: string
  onSendMessage: (message: string) => void
}

export function RecipeDetails({ recipe, recipeName, onSendMessage }: RecipeDetailsProps) {
  if (!recipe) {
    return <div>No recipe found for {recipeName}.</div>
  }

  return (
    <div className="flex flex-col sm:flex-row h-[calc(100vh-6rem)]">
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
            {JSON.parse(recipe.cuisine).map((cuisine: string, index: number) => (
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
      <div className="w-full sm:w-1/2 flex flex-col border-t sm:border-l border-gray-200 h-full overflow-hidden">
        <RecipeChat 
          recipeId={recipe.id.toString()} 
        />
      </div>
    </div>
  )
}

