'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { motion } from 'framer-motion'
import { RecipeCard } from '@/components/RecipeCard'
import { RecipeDetails, RecipeDetailsProps } from '@/components/RecipeDetails'
import { LoadingAnimation } from '@/components/LoadingAnimation'
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerDescription } from '@/components/ui/drawer'
import axios from 'axios'
import { Wand2, ChefHat } from 'lucide-react'

interface Recipe {
  id:Number
  title: string
  instructions: string[]
  prepTime: string
  cookTime: string
  cuisine: string
}




export default function RecipePage() {
  const { id } = useParams()
  const [recipeData, setRecipeData] = useState<Recipe[] | null>(null)
  const [loading, setLoading] = useState(true)
  const [selectedRecipe, setSelectedRecipe] = useState<string | null>(null)
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)

  useEffect(() => {
    const loadRecipeData = async () => {
      try {
        const res = await axios.get(`/api/generate-recipe/?recipesId=${id}`)
        console.log(res.data)
        
        setRecipeData(res.data)
      } catch (error) {
        console.error('Failed to fetch recipe data:', error)
      } finally {
        setLoading(false)
      }
    }

    loadRecipeData()
  }, [id])

  const handleSendMessage = (message: string) => {
    console.log('Sending message:', message)
  }

  const handleRecipeSelect = (recipeName: string) => {
    setSelectedRecipe(recipeName)
    setIsDrawerOpen(true)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-primary/10 to-secondary/10">
        <LoadingAnimation />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/10 to-secondary/10 p-4 sm:p-8">
      <div className="max-w-7xl mx-auto">
        <motion.h1 
          className="text-2xl sm:text-4xl font-bold text-gray-800 mb-4 sm:mb-8 text-center"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          Chef AI Recipes
        </motion.h1>
        <motion.div 
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}

        >

         
          {recipeData && recipeData.map(( recipe, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
             
              <RecipeCard
                name={recipe.title}
                prepTime={recipe.prepTime}
                cookTime={recipe.cookTime}
                cuisine={recipe.cuisine}
                onClick={() => handleRecipeSelect(recipe.title)}
              />
            </motion.div>
          ))}
        </motion.div>
      </div>
      <Drawer open={isDrawerOpen} onOpenChange={setIsDrawerOpen} >
        <DrawerContent className="h-[90vh] rounded-t-[10px]">
          <DrawerHeader>
            <DrawerTitle>Recipe Details</DrawerTitle>
            <DrawerDescription>View recipe details and chat with Chef AI</DrawerDescription>
          </DrawerHeader>
          {selectedRecipe && recipeData && (
            <RecipeDetails
              recipe={recipeData.find((recipe) => recipe.title === selectedRecipe) || recipeData[0]}
              recipeName={selectedRecipe}
              onSendMessage={handleSendMessage}
            />
          )}
        </DrawerContent>
      </Drawer>
    </div>
  )
}

