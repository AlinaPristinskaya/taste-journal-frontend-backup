export type Recipe = {
  id: string
  title: string
  image: string
  category?: string
  source?: string
}

/* 🔽 ДОБАВЬ ЭТО */
export type MealDBMeal = {
  idMeal: string
  strMeal: string
  strMealThumb: string
  strCategory?: string
  strSource?: string
  strYoutube?: string
}

export type MealDBResponse = {
  meals: MealDBMeal[] | null
}