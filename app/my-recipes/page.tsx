'use client'

import { useUser } from '../context/UserContext'
import RecipeCard from '../components/RecipeCard'

export default function MyRecipesPage() {
  const { recipes } = useUser()

  if (recipes.length === 0) {
    return <p>У вас пока нет рецептов</p>
  }

  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-xl font-bold">Мои рецепты</h1>

      {recipes.map(recipe => (
        <RecipeCard key={recipe.id} recipe={recipe} />
      ))}
    </div>
  )
}