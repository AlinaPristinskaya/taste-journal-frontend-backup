export interface MealApiResponse {
  meals: Meal[] | null;
}

export interface Meal {
  idMeal: string;
  strMeal: string;
  strCategory: string;
  strMealThumb: string;
}

export async function fetchMeals(): Promise<Meal[]> {
  const res = await fetch(
    "https://www.themealdb.com/api/json/v1/1/search.php?s=",
    { cache: "no-store" }
  );

  if (!res.ok) {
    throw new Error("Failed to fetch meals");
  }

  const data: MealApiResponse = await res.json();
  return data.meals ?? [];
}