'use client';

import { useEffect, useMemo, useState } from 'react';
import RecipeCard from './components/RecipeCard';
import { useUser } from './context/UserContext';
import { createRecipe, fetchExternalRecipes } from './lib/api';
import { ExternalRecipe } from './types';

export default function HomePage() {
  const { isAuthenticated, token } = useUser();

  const [recipes, setRecipes] = useState<ExternalRecipe[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [categoryFilter, setCategoryFilter] = useState('all');
  const [savingId, setSavingId] = useState<string | null>(null);

  const categories = useMemo(() => {
    const set = new Set<string>();
    recipes.forEach((recipe) => {
      if (recipe.category) {
        set.add(recipe.category);
      }
    });
    return ['all', ...Array.from(set).sort()];
  }, [recipes]);

  const filteredRecipes = useMemo(() => {
    if (categoryFilter === 'all') {
      return recipes;
    }
    return recipes.filter((recipe) => recipe.category === categoryFilter);
  }, [recipes, categoryFilter]);

  async function loadExternalRecipes() {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchExternalRecipes();
      setRecipes(data);
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : 'Failed to fetch recipes');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadExternalRecipes();
  }, []);

  async function saveExternalRecipe(recipe: ExternalRecipe) {
    if (!token) {
      alert('Please login using the button in the header');
      return;
    }

    try {
      setSavingId(recipe.external_id);
      await createRecipe(token, {
        title: recipe.title,
        content: recipe.content,
        category: recipe.category,
        source_type: 'external',
        external_id: recipe.external_id,
        image_url: recipe.image_url,
        source_url: recipe.source_url,
      });
      alert('Recipe saved to your collection');
    } catch (requestError) {
      alert(requestError instanceof Error ? requestError.message : 'Failed to save recipe');
    } finally {
      setSavingId(null);
    }
  }

  return (
    <div className="stack">
      <section className="panel">
        <h1>External Recipes</h1>
        <p className="muted">Browse recipes from MealDB and save them to your personal collection.</p>

        <div className="row">
          <button className="button" onClick={loadExternalRecipes} disabled={loading}>
            {loading ? 'Loading...' : 'Reload Recipes'}
          </button>

          <select
            className="input"
            value={categoryFilter}
            onChange={(event) => setCategoryFilter(event.target.value)}
          >
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>

        {error ? <p className="error">{error}</p> : null}

        <div className="grid">
          {filteredRecipes.map((recipe) => (
            <RecipeCard
              key={recipe.external_id}
              recipe={{ ...recipe, source_type: 'external' }}
              actions={
                isAuthenticated ? (
                  <button
                    className="button"
                    disabled={savingId === recipe.external_id}
                    onClick={() => saveExternalRecipe(recipe)}
                  >
                    {savingId === recipe.external_id ? 'Saving...' : 'Save to My Recipes'}
                  </button>
                ) : null
              }
            />
          ))}
        </div>
      </section>
    </div>
  );
}
