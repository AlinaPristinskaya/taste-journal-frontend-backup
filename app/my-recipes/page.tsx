'use client';

import { FormEvent, useCallback, useEffect, useMemo, useState } from 'react';
import RecipeCard from '../components/RecipeCard';
import { useUser } from '../context/UserContext';
import { createRecipe, deleteRecipe, getMyRecipes, updateRecipe } from '../lib/api';
import { Recipe, SourceType } from '../types';

type RecipeForm = {
  title: string;
  content: string;
  category: string;
  source_type: SourceType;
  external_id: string;
  image_url: string;
  source_url: string;
};

const initialForm: RecipeForm = {
  title: '',
  content: '',
  category: '',
  source_type: 'manual',
  external_id: '',
  image_url: '',
  source_url: '',
};

export default function MyRecipesPage() {
  const { token, isAuthenticated } = useUser();

  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState<RecipeForm>(initialForm);
  const [submitting, setSubmitting] = useState(false);

  const [categoryFilter, setCategoryFilter] = useState('all');
  const [sourceFilter, setSourceFilter] = useState<SourceType | 'all'>('all');

  const categories = useMemo(() => {
    const set = new Set<string>();
    recipes.forEach((recipe) => {
      if (recipe.category) {
        set.add(recipe.category);
      }
    });
    return ['all', ...Array.from(set).sort()];
  }, [recipes]);

  const loadRecipes = useCallback(async () => {
    if (!token) {
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const data = await getMyRecipes(token, {
        category: categoryFilter === 'all' ? undefined : categoryFilter,
        source_type: sourceFilter,
      });
      setRecipes(data);
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : 'Failed to fetch recipes');
    } finally {
      setLoading(false);
    }
  }, [token, categoryFilter, sourceFilter]);

  useEffect(() => {
    loadRecipes();
  }, [loadRecipes]);

  function resetForm() {
    setForm(initialForm);
    setEditingId(null);
  }

  function startEdit(recipe: Recipe) {
    setEditingId(recipe.id);
    setForm({
      title: recipe.title,
      content: recipe.content,
      category: recipe.category || '',
      source_type: recipe.source_type,
      external_id: recipe.external_id || '',
      image_url: recipe.image_url || '',
      source_url: recipe.source_url || '',
    });
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!token) {
      return;
    }

    try {
      setSubmitting(true);
      setError(null);

      const payload = {
        title: form.title.trim(),
        content: form.content.trim(),
        category: form.category.trim() || null,
        source_type: form.source_type,
        external_id: form.external_id.trim() || null,
        image_url: form.image_url.trim() || null,
        source_url: form.source_url.trim() || null,
      };

      if (editingId) {
        await updateRecipe(token, editingId, payload);
      } else {
        await createRecipe(token, payload);
      }

      resetForm();
      await loadRecipes();
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : 'Failed to save recipe');
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDelete(id: number) {
    if (!token) {
      return;
    }

    try {
      await deleteRecipe(token, id);
      await loadRecipes();
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : 'Failed to delete recipe');
    }
  }

  if (!isAuthenticated) {
    return (
      <section className="panel">
        <h1>My Recipes</h1>
        <p>Please login on the main page to manage your recipe collection.</p>
      </section>
    );
  }

  return (
    <div className="stack">
      <section className="panel">
        <h1>{editingId ? 'Edit Recipe' : 'Create Manual Recipe'}</h1>

        <form className="stack" onSubmit={handleSubmit}>
          <input
            className="input"
            placeholder="Title"
            value={form.title}
            onChange={(event) => setForm((prev) => ({ ...prev, title: event.target.value }))}
            required
          />

          <textarea
            className="input"
            placeholder="Content / Instructions"
            rows={5}
            value={form.content}
            onChange={(event) => setForm((prev) => ({ ...prev, content: event.target.value }))}
            required
          />

          <input
            className="input"
            placeholder="Category"
            value={form.category}
            onChange={(event) => setForm((prev) => ({ ...prev, category: event.target.value }))}
          />

          <select
            className="input"
            value={form.source_type}
            onChange={(event) =>
              setForm((prev) => ({ ...prev, source_type: event.target.value as SourceType }))
            }
          >
            <option value="manual">manual</option>
            <option value="external">external</option>
          </select>

          <input
            className="input"
            placeholder="External ID (optional)"
            value={form.external_id}
            onChange={(event) => setForm((prev) => ({ ...prev, external_id: event.target.value }))}
          />

          <input
            className="input"
            placeholder="Image URL (optional)"
            value={form.image_url}
            onChange={(event) => setForm((prev) => ({ ...prev, image_url: event.target.value }))}
          />

          <input
            className="input"
            placeholder="Source URL (optional)"
            value={form.source_url}
            onChange={(event) => setForm((prev) => ({ ...prev, source_url: event.target.value }))}
          />

          <div className="row">
            <button className="button" type="submit" disabled={submitting}>
              {submitting ? 'Saving...' : editingId ? 'Update Recipe' : 'Create Recipe'}
            </button>
            {editingId ? (
              <button className="button button-secondary" type="button" onClick={resetForm}>
                Cancel Edit
              </button>
            ) : null}
          </div>
        </form>

        {error ? <p className="error">{error}</p> : null}
      </section>

      <section className="panel">
        <h2>My Collection</h2>

        <div className="row">
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

          <select
            className="input"
            value={sourceFilter}
            onChange={(event) => setSourceFilter(event.target.value as SourceType | 'all')}
          >
            <option value="all">all</option>
            <option value="manual">manual</option>
            <option value="external">external</option>
          </select>

          <button className="button" onClick={loadRecipes} disabled={loading}>
            {loading ? 'Refreshing...' : 'Refresh'}
          </button>
        </div>

        {recipes.length === 0 ? <p className="muted">No recipes found for selected filters.</p> : null}

        <div className="grid">
          {recipes.map((recipe) => (
            <RecipeCard
              key={recipe.id}
              recipe={recipe}
              href={`/recipe/${recipe.id}`}
              actions={
                <>
                  <button className="button button-secondary" onClick={() => startEdit(recipe)}>
                    Edit
                  </button>
                  <button className="button button-danger" onClick={() => handleDelete(recipe.id)}>
                    Delete
                  </button>
                </>
              }
            />
          ))}
        </div>
      </section>
    </div>
  );
}
