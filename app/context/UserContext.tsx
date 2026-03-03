'use client'

import { createContext, useContext, useState } from 'react'
import { Recipe } from '../types'

type UserContextType = {
  recipes: Recipe[]
  addRecipe: (recipe: Recipe) => void
}

const UserContext = createContext<UserContextType | null>(null)

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [recipes, setRecipes] = useState<Recipe[]>([])

  const addRecipe = (recipe: Recipe) => {
    setRecipes(prev => {
      if (prev.find(r => r.id === recipe.id)) return prev
      return [...prev, recipe]
    })
  }

  return (
    <UserContext.Provider value={{ recipes, addRecipe }}>
      {children}
    </UserContext.Provider>
  )
}

export function useUser() {
  const ctx = useContext(UserContext)
  if (!ctx) throw new Error('useUser must be used inside UserProvider')
  return ctx
}