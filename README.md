# FoodBridge

FoodBridge connects restaurants with NGOs and recycling partners to help reduce food waste.

## Project structure

- `frontend/` — React, Vite, Tailwind CSS, and React Router.
- `backend/` — Express API, Prisma, and MySQL configuration.

## Local setup

1. Start MySQL with `docker compose up -d`.
2. Copy `backend/.env.example` to `backend/.env` and adjust values if needed.
3. Run `npm run prisma:generate` and `npm run prisma:migrate` inside `backend/` after the first Prisma model is added.
4. Start the API with `npm run dev` inside `backend/`.
5. Start the frontend with `npm run dev` inside `frontend/`.

The API health check is available at `http://localhost:5000/health`.
