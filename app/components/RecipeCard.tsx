import Image from 'next/image'
import { Recipe } from '@/app/types'

type Props = {
  recipe: Recipe
}

export default function RecipeCard({ recipe }: Props) {
  return (
    <div className="rounded-lg border p-4 shadow-sm">
      <Image
        src={recipe.image}
        alt={recipe.title}
        width={300}
        height={200}
        className="rounded-md"
      />

      <h3 className="mt-2 text-lg font-semibold">
        {recipe.title}
      </h3>

      <p className="text-sm text-gray-500">
        {recipe.category}
      </p>

      {recipe.source && (
        <a
          href={recipe.source}
          target="_blank"
          className="text-sm text-blue-600 underline"
        >
          Source
        </a>
      )}
    </div>
  )
}