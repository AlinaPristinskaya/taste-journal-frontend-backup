import { ReactNode } from 'react';

type CardRecipe = {
  title: string;
  content?: string;
  category?: string | null;
  image_url?: string | null;
  source_url?: string | null;
  source_type?: string;
};

type Props = {
  recipe: CardRecipe;
  actions?: ReactNode;
};

export default function RecipeCard({ recipe, actions }: Props) {
  return (
    <article className="card">
      {recipe.image_url ? (
        <img src={recipe.image_url} alt={recipe.title} className="card-image" />
      ) : (
        <div className="card-image card-image-placeholder">No image</div>
      )}

      <div className="card-body">
        <h3>{recipe.title}</h3>

        <p className="muted">
          {recipe.category || 'Uncategorized'}
          {recipe.source_type ? ` - ${recipe.source_type}` : ''}
        </p>

        {recipe.content ? <p className="content-preview">{recipe.content}</p> : null}

        <div className="card-actions">
          {recipe.source_url ? (
            <a href={recipe.source_url} target="_blank" rel="noreferrer" className="button button-link">
              Open Source
            </a>
          ) : null}
          {actions}
        </div>
      </div>
    </article>
  );
}
