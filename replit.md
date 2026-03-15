# YC Bench

A live benchmark platform for evaluating and predicting YC startup outperformers.

## Architecture

- **Frontend**: React 19 + Vite, using Wouter for routing, TailwindCSS v4, shadcn/ui components
- **Backend**: Express 5 (TypeScript) via `tsx`, served on port 5000
- **Shared**: Drizzle ORM schema in `shared/schema.ts` (PostgreSQL)
- **Build**: Custom `script/build.ts` — Vite for client, esbuild for server → `dist/index.cjs`

## Project Structure

```
client/          React frontend (Vite root)
  src/
    pages/       Page components (home, blog, blog-post, not-found)
    components/  UI components (shadcn/ui + custom)
    lib/         Utilities (queryClient, etc.)
server/          Express backend
  index.ts       Entry point, port 5000
  routes.ts      API routes (prefix /api)
  blog.ts        Markdown blog helpers (gray-matter + marked + sanitize-html)
  storage.ts     Data storage interface (MemStorage default)
  static.ts      Production static file serving
  vite.ts        Development Vite middleware
shared/          Shared types/schema
  schema.ts      Drizzle ORM table definitions
content/
  posts/         Markdown blog posts (frontmatter: title, description, date, author)
script/
  build.ts       Production build (Vite + esbuild)
```

## Blog System

- Posts live in `content/posts/*.md` with frontmatter (`title`, `description`, `date`, `author`)
- Backend reads, parses (marked), and sanitizes (sanitize-html) posts at request time
- API: `GET /api/posts` — list, `GET /api/posts/:slug` — single post (returns sanitized HTML)
- Frontend routes: `/blog` (list) and `/blog/:slug` (post)
- Tailwind Typography plugin (`@tailwindcss/typography`) used for post body styling

## Running

- **Dev**: `npm run dev` — starts Express + Vite dev middleware on port 5000
- **Build**: `npm run build` — produces `dist/index.cjs` + `dist/public/`
- **Start**: `npm run start` — production mode

## Environment Variables

- `DATABASE_URL` — PostgreSQL connection string (required for DB features and drizzle-kit)
- `PORT` — defaults to 5000

## Notes

- Migrated from Vercel to Replit — already structured as a Replit-native Express/Vite app
- Uses `memorystore` for sessions by default; swap to `connect-pg-simple` + DATABASE_URL for persistence
- All API routes must be prefixed with `/api`
