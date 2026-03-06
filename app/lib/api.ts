import {
  AuthResponse,
  ExternalRecipe,
  MealDBResponse,
  Recipe,
  SourceType,
} from '../types';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  let res: Response;

  try {
    res = await fetch(`${API_URL}${path}`, {
      ...init,
      headers: {
        'Content-Type': 'application/json',
        ...(init?.headers || {}),
      },
      cache: 'no-store',
    });
  } catch {
    throw new Error(`Cannot connect to backend at ${API_URL}. Start server on port 3001.`);
  }

  if (!res.ok) {
    let message = 'Request failed';
    try {
      const data = await res.json();
      message = data.message || message;
    } catch {
      // Ignore invalid JSON errors from server
    }
    throw new Error(message);
  }

  return res.json();
}

export async function register(name: string, email: string, password: string): Promise<AuthResponse> {
  return request<AuthResponse>('/auth/register', {
    method: 'POST',
    body: JSON.stringify({ name, email, password }),
  });
}

export async function login(email: string, password: string): Promise<AuthResponse> {
  return request<AuthResponse>('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });
}

export async function logout(token: string): Promise<void> {
  await request<{ message: string }>('/auth/logout', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}

export async function getMyRecipes(token: string, filters?: { category?: string; source_type?: SourceType | 'all' }) {
  const params = new URLSearchParams();

  if (filters?.category) {
    params.set('category', filters.category);
  }

  if (filters?.source_type && filters.source_type !== 'all') {
    params.set('source_type', filters.source_type);
  }

  const suffix = params.toString() ? `?${params.toString()}` : '';

  return request<Recipe[]>(`/recipes/mine${suffix}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}

export async function createRecipe(
  token: string,
  payload: {
    title: string;
    content: string;
    category?: string | null;
    source_type?: SourceType;
    external_id?: string | null;
    image_url?: string | null;
    source_url?: string | null;
  }
) {
  return request<Recipe>('/recipes', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });
}

export async function uploadImage(token: string, file: File): Promise<{ image_url: string }> {
  const formData = new FormData();
  formData.append('image', file);

  let res: Response;

  try {
    res = await fetch(`${API_URL}/upload-image`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });
  } catch {
    throw new Error(`Cannot connect to backend at ${API_URL}. Start server on port 3001.`);
  }

  if (!res.ok) {
    let message = 'Failed to upload image';
    try {
      const data = await res.json();
      message = data.message || message;
    } catch {
      // Ignore invalid JSON errors from server
    }
    throw new Error(message);
  }

  return res.json();
}

export async function updateRecipe(
  token: string,
  id: number,
  payload: {
    title: string;
    content: string;
    category?: string | null;
    source_type?: SourceType;
    external_id?: string | null;
    image_url?: string | null;
    source_url?: string | null;
  }
) {
  return request<Recipe>(`/recipes/${id}`, {
    method: 'PUT',
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });
}

export async function deleteRecipe(token: string, id: number) {
  return request<{ message: string }>(`/recipes/${id}`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}

export async function getCategories() {
  return request<string[]>('/categories');
}

export async function getRecipeById(id: string) {
  return request<Recipe>(`/recipes/${id}`);
}

export async function fetchExternalRecipes(): Promise<ExternalRecipe[]> {
  const res = await fetch('https://www.themealdb.com/api/json/v1/1/search.php?s=', {
    cache: 'no-store',
  });

  if (!res.ok) {
    throw new Error('Failed to fetch external recipes');
  }

  const data: MealDBResponse = await res.json();

  return (
    data.meals?.map((meal) => ({
      external_id: meal.idMeal,
      title: meal.strMeal,
      content: meal.strInstructions || 'Imported from MealDB',
      category: meal.strCategory || null,
      image_url: meal.strMealThumb || null,
      source_url: meal.strSource || meal.strYoutube || null,
    })) || []
  );
}
