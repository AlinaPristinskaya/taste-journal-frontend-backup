'use client';

import { Suspense, useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { getRecipeById } from '../lib/api';

type RecipeView = {
  title: string;
  category: string | null;
  image_url: string | null;
  content: string;
};

async function loadExternalRecipe(externalId: string): Promise<RecipeView | null> {
  try {
    const res = await fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${externalId}`);

    if (!res.ok) {
      return null;
    }

    const data = await res.json();
    const meal = data?.meals?.[0];

    if (!meal) {
      return null;
    }

    return {
      title: meal.strMeal,
      category: meal.strCategory || null,
      image_url: meal.strMealThumb || null,
      content: meal.strInstructions || 'No instructions available.',
    };
  } catch {
    return null;
  }
}

async function loadRecipe(id: string): Promise<RecipeView | null> {
  if (id.startsWith('external-')) {
    return loadExternalRecipe(id.replace('external-', ''));
  }

  try {
    return await getRecipeById(id);
  } catch {
    return null;
  }
}

function RecipeDetails() {
  const searchParams = useSearchParams();
  const id = searchParams.get('id');
  const [recipe, setRecipe] = useState<RecipeView | null>(null);
  const [loading, setLoading] = useState(Boolean(id));
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isActive = true;

    async function run() {
      if (!id) {
        setLoading(false);
        setError('Recipe id is missing.');
        return;
      }

      setLoading(true);
      setError(null);

      const nextRecipe = await loadRecipe(id);

      if (!isActive) {
        return;
      }

      setRecipe(nextRecipe);
      setLoading(false);

      if (!nextRecipe) {
        setError('Unable to load recipe details.');
      }
    }

    run();

    return () => {
      isActive = false;
    };
  }, [id]);

  if (loading) {
    return (
      <section className="panel">
        <h1>Loading Recipe</h1>
        <p className="muted">Fetching recipe details...</p>
      </section>
    );
  }

  if (!recipe) {
    return (
      <section className="panel">
        <h1>Recipe Not Found</h1>
        <p>{error || 'Unable to load recipe details.'}</p>
      </section>
    );
  }

  return (
    <section className="panel">
      <h1>{recipe.title}</h1>
      <p className="muted">{recipe.category || 'Uncategorized'}</p>
      {recipe.image_url ? <img src={recipe.image_url} alt={recipe.title} className="detail-image" /> : null}
      <p className="detail-content">{recipe.content}</p>
    </section>
  );
}

export default function RecipePage() {
  return (
    <Suspense
      fallback={
        <section className="panel">
          <h1>Loading Recipe</h1>
          <p className="muted">Preparing recipe details...</p>
        </section>
      }
    >
      <RecipeDetails />
    </Suspense>
  );
}
