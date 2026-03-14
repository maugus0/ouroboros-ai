# OuroborosAI

React + Vite + TypeScript client dashboard for OuroborosAI — a Multi-Agent AI System for Scholarship Discovery & Application Assistance (NUS ISS Team 17). Uses React Router for navigation, TanStack Query for server state, and shadcn/ui (Radix) + Tailwind CSS for UI.

## What's in the app

- **Auth flow**: `/login` → protected `/dashboard/*` routes
- **Dashboard**: Agentic AI chat interface — sidebar with conversation history, new chat, profile
- **API integration**: Configurable via Vite env vars (`VITE_API_BASE_URL`, `VITE_API_VERSION`); dev default: `http://localhost:8000`

## Prerequisites

- **Node.js**: 20+ (see `.nvmrc`)
- **npm**: 10+ (project uses `package-lock.json`)

## Setup

1. Install dependencies:

```bash
npm ci
```

2. Create your local env file:

```bash
cp .env.example .env.local
```

Then edit `.env.local` as needed.

3. Start the dev server:

```bash
npm run dev
```

Dev runs on **http://localhost:8080** (see `vite.config.ts`).

## Environment variables

The app reads env vars via Vite (`import.meta.env`) and centralizes them in `src/config/env.ts`.

| Variable | Description | Default |
|---|---|---|
| `VITE_API_BASE_URL` | Base URL for the backend | `http://localhost:8000` |
| `VITE_API_VERSION` | API version segment | `v1` |

## Routing (React Router)

Routes are defined in `src/App.tsx`:

**Public**

- `/login`

**Protected**

- `/dashboard` (index)

**Other**

- `*` → NotFound

Protection is handled by `src/components/ProtectedRoute.tsx`.

## Project structure

```
src/
  components/
    auth/
      LoginForm.tsx
      SignUpForm.tsx
    layout/               # (future: DashboardLayout, Sidebar, Header)
    ErrorBoundary.tsx
    ProtectedRoute.tsx
    ui/                   # shadcn/ui (button, card, form, input, etc.)
  config/
    env.ts
  contexts/
    AuthContext.tsx
  hooks/
    use-mobile.tsx
    use-toast.ts
  lib/
    api/
      client.ts
      endpoints.ts
    utils.ts              # cn() helper
  pages/
    Login.tsx
    Dashboard.tsx
    NotFound.tsx
  services/
    auth.ts
  types/
    api.types.ts
    auth.types.ts
  App.tsx
  main.tsx
  index.css
  vite-env.d.ts
```

## Scripts

| Script | Description |
|---|---|
| `npm run dev` | Start dev server |
| `npm run build` | Production build → `dist/` |
| `npm run build:gh-pages` | Build with GitHub Pages base path |
| `npm run preview` | Preview production build locally |
| `npm run lint` | ESLint |
| `npm run format` | Prettier (write) |
| `npm run format:check` | Prettier (check only) |
| `npm run test` | Vitest (watch) |
| `npm run test:ci` | Vitest (single run + coverage) |
| `npm run test:watch` | Vitest (watch) |
| `npm run deploy` | Build for GitHub Pages and deploy via gh-pages |

## Deployment — ouroboros.chat

The dashboard is deployed to **https://ouroboros.chat** via GitHub Pages with a custom domain.

Key files:

| File | Purpose |
|---|---|
| `public/CNAME` | Defines custom domain `ouroboros.chat`; copied to `dist/` by Vite |
| `vite.config.ts` | `base: '/'` for correct asset URLs on the root domain |
| `public/404.html` | SPA routing with `pathSegmentsToKeep = 0` for root domain |
| `index.html` | Redirect handler matching `404.html` `?p=` scheme |
| `.github/workflows/deploy.yml` | CI/CD pipeline; verifies CNAME, deploys, health-checks ouroboros.chat |

Build for production:

```bash
npm run build
```

## Docker (static hosting via Nginx)

Build and run:

```bash
docker build -t ouroboros-ai .
docker run -p 80:80 ouroboros-ai
```

Nginx is configured in `nginx.conf` for SPA routing (`try_files ... /index.html`).

## Tech stack

- React 19, TypeScript
- Vite 8
- Tailwind CSS
- shadcn/ui + Radix UI
- React Router v7
- TanStack Query
- Sonner (toast notifications)
- Vitest
