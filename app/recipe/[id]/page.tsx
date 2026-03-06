import { getRecipeById } from '../../lib/api';

type RecipePageProps = {
  params: Promise<{ id: string }>;
};

async function loadRecipe(id: string) {
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
