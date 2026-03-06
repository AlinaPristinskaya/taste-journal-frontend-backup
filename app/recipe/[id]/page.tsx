import { getRecipeById } from '../../lib/api';

type RecipePageProps = {
  params: Promise<{ id: string }>;
};

type RecipeView = {
  title: string;
  category: string | null;
  image_url: string | null;
  content: string;
};

async function loadExternalRecipe(externalId: string): Promise<RecipeView | null> {
  try {
    const res = await fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${externalId}`, {
      cache: 'no-store',
    });

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
    const externalId = id.replace('external-', '');
    return loadExternalRecipe(externalId);
  }

  try {
    return await getRecipeById(id);
  } catch {
    return null;
  }
}

export default async function RecipePage({ params }: RecipePageProps) {
  const { id } = await params;
  const recipe = await loadRecipe(id);

  if (!recipe) {
    return (
      <section className="panel">
        <h1>Recipe Not Found</h1>
        <p>Unable to load recipe details.</p>
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
