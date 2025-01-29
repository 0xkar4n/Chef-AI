import { Header } from '@/components/Header'
import { Hero } from '@/components/Hero'
import { Features } from '@/components/Features'
import { Blobs } from '@/components/Blobs'
import { RecipeCategories } from '@/components/RecipeCategories'

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      <Blobs />
      <Header />
      <main className="pt-16 sm:pt-20">
        <Hero />
        <Features />
        <RecipeCategories />
      </main>
    </div>
  )
}

