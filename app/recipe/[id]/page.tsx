import Image from 'next/image';

async function getRecipe(id: string) {
  const res = await fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`);
  const data = await res.json();
  return data.meals[0];
}

export default async function RecipePage({ params }: { params: { id: string } }) {
  const recipe = await getRecipe(params.id);

  return (
    <div>
      <h1 className="text-2xl font-bold">{recipe.strMeal}</h1>
      <Image src={recipe.strMealThumb} alt={recipe.strMeal} width={600} height={400} />
      <p className="mt-4">{recipe.strInstructions}</p>
    </div>
  );
}