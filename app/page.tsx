'use client'

import { useEffect, useState } from 'react'
import RecipeCard from './components/RecipeCard'
import { Recipe, MealDBResponse } from './types'

export default function HomePage() {
  const [recipes, setRecipes] = useState<Recipe[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchRecipes() {
      try {
        setLoading(true)

        const res = await fetch(
          'https://www.themealdb.com/api/json/v1/1/search.php?s='
        )

        if (!res.ok) {
          throw new Error('Failed to fetch recipes')
        }

        const data: MealDBResponse = await res.json()

const mappedRecipes: Recipe[] =
  data.meals?.map((meal) => ({
    id: meal.idMeal,
    title: meal.strMeal,
    image: meal.strMealThumb,
    category: meal.strCategory,
    source: meal.strSource || meal.strYoutube,
  })) || []

        setRecipes(mappedRecipes)
      } catch (err) {
        console.error(err)
        setError('Ошибка загрузки рецептов')
      } finally {
        setLoading(false)
      }
    }

    fetchRecipes()
  }, [])

  if (loading) {
    return <p>Загрузка рецептов...</p>
  }

  if (error) {
    return <p>{error}</p>
  }

  return (
    <main>
      <h1>Рецепты</h1>

      {recipes.length === 0 && <p>Рецепты не найдены</p>}

      <div>
        {recipes.map((recipe) => (
          <RecipeCard key={recipe.id} recipe={recipe} />
        ))}
      </div>
    </main>
  )
}