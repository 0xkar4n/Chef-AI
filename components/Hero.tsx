'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { useCallback, useEffect, useRef, useState } from 'react'
import { Sparkles } from 'lucide-react'
import { LoadingAnimation } from './LoadingAnimation'
import { drawTextOnCanvas } from '@/utils/canvaUtils'
import { cn } from '@/lib/utils'
import { useRouter } from 'next/navigation'
import axios from 'axios'

const placeholders = [
  "Enter ingredients (e.g., chicken, rice, tomatoes)",
  "What's in your fridge?",
  "Got leftovers? Let's make something delicious!",
  "Craving something specific? Tell us!",
];

export function Hero() {
  const [ingredients, setIngredients] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [currentPlaceholder, setCurrentPlaceholder] = useState(0)
  const [animating, setAnimating] = useState(false)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const newDataRef = useRef<any[]>([])
  const inputRef = useRef<HTMLInputElement>(null)
  const router = useRouter()

  const startAnimation = useCallback(() => {
    intervalRef.current = setInterval(() => {
      setCurrentPlaceholder((prev) => (prev + 1) % placeholders.length);
    }, 3000);
  }, []);

  const handleVisibilityChange = useCallback(() => {
    if (document.visibilityState !== "visible" && intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    } else if (document.visibilityState === "visible") {
      startAnimation();
    }
  }, [startAnimation]);

  useEffect(() => {
    startAnimation();
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [startAnimation, handleVisibilityChange]);

  const draw = useCallback(() => {
    newDataRef.current = drawTextOnCanvas(ingredients, inputRef, canvasRef);
  }, [ingredients]);

  useEffect(() => {
    draw();
  }, [ingredients, draw]);

  const animate = (start: number) => {
    const animateFrame = (pos: number = 0) => {
      requestAnimationFrame(() => {
        const newArr = [];
        for (let i = 0; i < newDataRef.current.length; i++) {
          const current = newDataRef.current[i];
          if (current.x < pos) {
            newArr.push(current);
          } else {
            if (current.r <= 0) {
              current.r = 0;
              continue;
            }
            current.x += Math.random() > 0.5 ? 1 : -1;
            current.y += Math.random() > 0.5 ? 1 : -1;
            current.r -= 0.05 * Math.random();
            newArr.push(current);
          }
        }
        newDataRef.current = newArr;
        const ctx = canvasRef.current?.getContext("2d");
        if (ctx) {
          ctx.clearRect(pos, 0, 800, 800);
          newDataRef.current.forEach((t) => {
            const { x: n, y: i, r: s, color: color } = t;
            if (n > pos) {
              ctx.beginPath();
              ctx.rect(n, i, s, s);
              ctx.fillStyle = color;
              ctx.strokeStyle = color;
              ctx.stroke();
            }
          });
        }
        if (newDataRef.current.length > 0) {
          animateFrame(pos - 8);
        } else {
          setIngredients("");
          setAnimating(false);
        }
      });
    };
    animateFrame(start);
  };

  const handleFindRecipes = async (e: React.FormEvent) => {
    e.preventDefault();
    if (animating || !ingredients) return;

    setAnimating(true);
    draw();

    const maxX = newDataRef.current.reduce(
      (prev, current) => (current.x > prev ? current.x : prev),
      0
    );
    animate(maxX);

    setIsLoading(true);
   const response= await axios.post('/api/generate-recipe',{prompt: ingredients})
   
   console.log(response)
   const generatedRecipe = response.data

   console.log(generatedRecipe)
    setIsLoading(false);
    
    
    router.push(`/recipe/${generatedRecipe.addRecipe.id}`);
  
  }

  return (
    <section className="relative py-12 sm:py-16 md:py-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
      <motion.div 
        className="absolute inset-0 bg-gradient-to-br from-primary/10 to-secondary/10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      />
      <div className="max-w-5xl mx-auto text-center relative z-10">
        <motion.h1 
          className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 sm:mb-6 text-gray-800 bg-clip-text text-transparent bg-gradient-to-r from-primary via-accent to-secondary"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          Turn Your Ingredients into Delicious Meals
        </motion.h1>
        <motion.p 
          className="text-lg sm:text-xl mb-6 sm:mb-8 text-gray-600 max-w-2xl mx-auto"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          Enter the ingredients you have, and let Chef AI suggest amazing recipes!
        </motion.p>
        <motion.div 
          className="flex flex-col sm:flex-row gap-4 justify-center items-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <form
            className={cn(
              "w-full relative max-w-xl mx-auto bg-white dark:bg-zinc-800 h-12 rounded-full overflow-hidden shadow-[0px_2px_3px_-1px_rgba(0,0,0,0.1),_0px_1px_0px_0px_rgba(25,28,33,0.02),_0px_0px_0px_1px_rgba(25,28,33,0.08)] transition duration-200",
              ingredients && "bg-gray-50"
            )}
            onSubmit={handleFindRecipes}
          >
            <canvas
              className={cn(
                "absolute pointer-events-none text-base transform scale-50 top-[20%] left-2 sm:left-8 origin-top-left filter invert dark:invert-0 pr-20",
                !animating ? "opacity-0" : "opacity-100"
              )}
              ref={canvasRef}
            />
            <input
              ref={inputRef}
              type="text"
              value={ingredients}
              onChange={(e) => !animating && setIngredients(e.target.value)}
              className={cn(
                "w-full relative text-sm sm:text-base z-50 border-none dark:text-white bg-transparent text-black h-full rounded-full focus:outline-none focus:ring-0 pl-4 sm:pl-10 pr-20",
                animating && "text-transparent dark:text-transparent"
              )}
            />
            <button
              disabled={!ingredients || isLoading}
              type="submit"
              className="absolute right-2 top-1/2 z-50 -translate-y-1/2 h-8 w-8 rounded-full disabled:bg-gray-100 bg-primary hover:bg-primary/90 dark:bg-zinc-900 dark:disabled:bg-zinc-800 transition duration-200 flex items-center justify-center"
            >
              <motion.svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-white h-4 w-4"
              >
                <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                <motion.path
                  d="M5 12l14 0"
                  initial={{
                    strokeDasharray: "50%",
                    strokeDashoffset: "50%",
                  }}
                  animate={{
                    strokeDashoffset: ingredients ? 0 : "50%",
                  }}
                  transition={{
                    duration: 0.3,
                    ease: "linear",
                  }}
                />
                <path d="M13 18l6 -6" />
                <path d="M13 6l6 6" />
              </motion.svg>
            </button>
            <div className="absolute inset-0 flex items-center rounded-full pointer-events-none">
              <AnimatePresence mode="wait">
                {!ingredients && (
                  <motion.p
                    initial={{
                      y: 5,
                      opacity: 0,
                    }}
                    key={`current-placeholder-${currentPlaceholder}`}
                    animate={{
                      y: 0,
                      opacity: 1,
                    }}
                    exit={{
                      y: -15,
                      opacity: 0,
                    }}
                    transition={{
                      duration: 0.3,
                      ease: "linear",
                    }}
                    className="dark:text-zinc-500 text-sm sm:text-base font-normal text-neutral-500 pl-4 sm:pl-12 text-left w-[calc(100%-2rem)] truncate"
                  >
                    {placeholders[currentPlaceholder]}
                  </motion.p>
                )}
              </AnimatePresence>
            </div>
          </form>
        </motion.div>
        {isLoading && (
          <motion.div 
            className="mt-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <LoadingAnimation />
            <p className="mt-4 text-gray-600">Cooking up some delicious recipes for you...</p>
          </motion.div>
        )}
      </div>
    </section>
  )
}

