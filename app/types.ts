export type SourceType = 'manual' | 'external';

export type AuthUser = {
  id: number;
  name: string;
  email: string;
};

export type AuthResponse = {
  user: AuthUser;
  token: string;
};

export type Recipe = {
  id: number;
  user_id: number;
  title: string;
  content: string;
  category: string | null;
  source_type: SourceType;
  external_id: string | null;
  image_url: string | null;
  source_url: string | null;
  created_at?: string;
  updated_at?: string;
  author?: string;
};

export type ExternalRecipe = {
  external_id: string;
  title: string;
  content: string;
  category: string | null;
  image_url: string | null;
  source_url: string | null;
};

export type MealDBRecipe = {
  idMeal: string;
  strMeal: string;
  strCategory: string;
  strMealThumb: string;
  strInstructions: string;
  strSource: string | null;
  strYoutube: string | null;
};

export type MealDBResponse = {
  meals: MealDBRecipe[] | null;
};
