# Taste Journal Frontend

Frontend for the Full Stack Tech Blog Application challenge (implemented as a recipe journal).

## What users can do

- Register and login via modal auth form
- Browse external recipes (MealDB)
- Save external recipes to their own collection
- Create manual recipes
- Edit and delete only their own recipes
- Filter by category and source type
- Open a recipe details page by clicking a card
- Upload recipe image from local computer

## Stack

- Next.js (App Router)
- React
- TypeScript
- CSS

## Environment variables

Create `.env.local` from `.env.example`:

- `NEXT_PUBLIC_API_URL` (backend URL)

Example:

```env
NEXT_PUBLIC_API_URL=http://localhost:3001
```

## Local run

```bash
npm install
npm run dev
```

App default: `http://localhost:3000`

## Production

- Frontend: Render Web Service
- Backend API: Render Web Service
- Database: Hosted MySQL (Aiven)

## API integration

Main backend endpoints used by UI:

- `/auth/register`
- `/auth/login`
- `/auth/logout`
- `/recipes`
- `/recipes/mine`
- `/recipes/:id`
- `/categories`
- `/upload-image`

## Final acceptance checklist

- [x] Register, login, logout
- [x] Create/update/delete own entries
- [x] Filter entries by category
- [x] Frontend dynamically uses backend API
- [x] Deployed online
