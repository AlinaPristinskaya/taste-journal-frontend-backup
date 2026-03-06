import Link from 'next/link';
import { ReactNode } from 'react';

type CardRecipe = {
  title: string;
  content?: string;
  category?: string | null;
  image_url?: string | null;
  source_type?: string;
};

type Props = {
  recipe: CardRecipe;
  href?: string;
  actions?: ReactNode;
};

export default function RecipeCard({ recipe, href, actions }: Props) {
  const cardContent = (
    <>
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
      </div>
    </>
  );

  return (
    <article className="card">
      {href ? <Link href={href} className="card-link">{cardContent}</Link> : cardContent}

      {actions ? <div className="card-actions">{actions}</div> : null}
    </article>
  );
}
