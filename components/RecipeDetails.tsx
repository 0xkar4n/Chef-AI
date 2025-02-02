'use client'

import { useState, useRef, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ChefHat, Send, Clock } from 'lucide-react'
import axios from 'axios'
import { RecipeChat } from './RecipeChat'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

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
      {/* Mobile View: Tabs */}
      <div className="block sm:hidden w-full p-4 sm:p-6 overflow-y-auto">
        <Tabs defaultValue="details" className="w-full">
          <TabsList>
            <TabsTrigger value="details">Recipe Details</TabsTrigger>
            <TabsTrigger value="chat">Chat</TabsTrigger>
          </TabsList>
          <TabsContent value="details">
            <RecipeDetailsContent recipe={recipe} recipeName={recipeName} />
          </TabsContent>
          <TabsContent value="chat">
            <RecipeChat recipeId={recipe.id.toString()} />
          </TabsContent>
        </Tabs>
      </div>
      {/* Desktop View: Side-by-Side */}
      <div className="hidden sm:flex w-full">
        <div className="w-1/2 p-4 sm:p-6 overflow-y-auto">
          <RecipeDetailsContent recipe={recipe} recipeName={recipeName} />
        </div>
        <div className="w-1/2 p-4 sm:p-6 overflow-y-auto">
          <RecipeChat recipeId={recipe.id.toString()} />
        </div>
      </div>
    </div>
  )
}

// Extracted Recipe Details Content for reuse
function RecipeDetailsContent({ recipe, recipeName }: { recipe: Recipe, recipeName: string }) {
  return (
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
  )
}

