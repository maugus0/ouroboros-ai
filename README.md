# OuroborosAI

React + Vite + TypeScript frontend for **OuroborosAI** — a Multi-Agent AI System for Scholarship Discovery & Application Assistance (NUS ISS Team 17). Uses React Router for navigation, TanStack Query for server state, and **shadcn/ui** (Radix) + Tailwind CSS for UI.

## What's in the app

- **Auth**: Login and Register at `/login` with protected routes; mock auth (e.g. `admin@ouroboros.ai` / `admin`) until backend is ready.
- **Dashboard**: After login, users land on an agentic AI chat interface (Claude-style):
  - **Sidebar**: OuroborosAI branding, New Chat, conversation history grouped by date, nav (Profile, Programs, Scholarships, Applications), Settings / Get Help / Search, and user block at bottom (avatar, name, email, dropdown: Account, Billing, Notifications, Log out).
  - **Chat**: Empty state with suggestion cards; message bubbles (user + assistant with markdown); typing indicator; input bar with file attach and send.
  - **Pages**: Profile, Programs, Scholarships, Applications (card layout on mobile, table on desktop), Settings (notifications + dark mode toggle).
- **Theming**: Dark/light mode via `ThemeContext`; preference persisted in `localStorage`; Settings page toggle.
- **API**: Configurable via Vite env vars (`VITE_API_BASE_URL`, `VITE_API_VERSION`); dev default: `http://localhost:8000`.

## Prerequisites

- **Node.js**: 20+ (see `package.json` `engines`; CI uses Node 22).
- **npm**: 10+ (project uses `package-lock.json` — commit it for reproducible installs).

## Setup

1. Install dependencies:

```bash
npm ci
```

2. (Optional) Local env:

```bash
cp .env.example .env.local
```

Edit `.env.local` as needed. Do not commit `.env.local` (it is in `.gitignore`).

3. Start the dev server:

```bash
npm run dev
```

Dev server runs at **http://localhost:8080** (see `vite.config.ts`).

## Environment variables

The app reads env vars via Vite (`import.meta.env`) and centralizes them in `src/config/env.ts`.

| Variable              | Description        | Default                  |
|-----------------------|--------------------|--------------------------|
| `VITE_API_BASE_URL`   | Backend base URL   | `http://localhost:8000`  |
| `VITE_API_VERSION`   | API version path   | `v1`                     |

## Routing (React Router)

Defined in `src/App.tsx`:

| Route                    | Description                    |
|--------------------------|--------------------------------|
| `/`                      | Redirects to `/dashboard`      |
| `/login`                 | Login / Register (public)      |
| `/dashboard`             | Chat (default); new chat       |
| `/dashboard/chat/:chatId`| Existing conversation          |
| `/dashboard/profile`     | Student profile                |
| `/dashboard/programs`     | Discovered programs            |
| `/dashboard/scholarships` | Matched scholarships           |
| `/dashboard/applications` | Application tracker            |
| `/dashboard/settings`    | User settings (e.g. dark mode) |
| `*`                      | 404 → NotFound                 |

All `/dashboard/*` routes are protected and wrapped by `DashboardLayout` (sidebar + main content). Protection is in `src/components/ProtectedRoute.tsx`.

## Project structure

```
src/
  components/
    auth/           # LoginForm, SignUpForm
    chat/           # ChatEmptyState, ChatInput, ChatMessages, MessageBubble, TypingIndicator
    layout/         # DashboardLayout, AppSidebar, DashboardHeader
    ui/             # shadcn/ui (button, card, form, sidebar, avatar, etc.)
    ErrorBoundary.tsx
    LoadingSpinner.tsx
    ProtectedRoute.tsx
  config/
    env.ts
  contexts/
    AuthContext.tsx
    ChatContext.tsx
    ThemeContext.tsx
  hooks/
    use-mobile.tsx
    use-toast.ts
  lib/
    api/
      client.ts
      endpoints.ts
    mock-data.ts
    utils.ts
  pages/
    Login.tsx
    ChatPage.tsx
    ProfilePage.tsx
    ProgramsPage.tsx
    ScholarshipsPage.tsx
    ApplicationsPage.tsx
    SettingsPage.tsx
    NotFound.tsx
  services/
    auth.ts
  types/
    api.types.ts
    auth.types.ts
    chat.types.ts
  App.tsx
  main.tsx
  index.css
  vite-env.d.ts
```

## Scripts

| Script               | Description                          |
|----------------------|--------------------------------------|
| `npm run dev`        | Start dev server (port 8080)         |
| `npm run build`      | Production build → `dist/`           |
| `npm run build:gh-pages` | Build for GitHub Pages            |
| `npm run preview`    | Preview production build locally     |
| `npm run lint`       | ESLint                               |
| `npm run format`     | Prettier (write)                     |
| `npm run format:check` | Prettier (check only)              |
| `npm run test`       | Vitest (watch)                       |
| `npm run test:ci`    | Vitest single run + coverage         |
| `npm run test:watch` | Vitest watch                         |
| `npm run deploy`     | Build and deploy to GitHub Pages     |

## Deployment — ouroboros.chat

The app is deployed to **https://ouroboros.chat** via GitHub Pages with a custom domain.

| File / folder      | Purpose |
|--------------------|--------|
| `public/CNAME`     | Custom domain `ouroboros.chat`; Vite copies it to `dist/` on build. **Only** `public/CNAME` is used (no root `CNAME`). |
| `public/404.html`  | SPA fallback for client-side routing on GitHub Pages. |
| `index.html`       | Entry HTML; includes redirect handling for `?p=` deep links. |
| `.github/workflows/deploy.yml` | CI/CD: lint, format check, unit tests, Docker build + Trivy, Snyk, build verification, deploy to gh-pages, health check, Playwright smoke test, ZAP baseline. Uses Node 24–compatible actions (e.g. `actions/checkout@v5`, `actions/setup-node@v5`, `actions/upload-artifact@v5`) and Node 22. |

Build for production:

```bash
npm run build
```

Ensure `dist/CNAME` exists and contains `ouroboros.chat` (sourced from `public/CNAME`).

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
- Tailwind CSS, shadcn/ui, Radix UI
- React Router v7
- TanStack Query
- Sonner (toast notifications)
- react-markdown, remark-gfm (chat messages)
- react-textarea-autosize (chat input)
- Vitest (unit tests)

## What not to commit

`.gitignore` is set up so you do **not** commit:

- `node_modules/`, `dist/`, `build/`, `coverage/`
- `.env`, `.env.local`, `.env.*.local`, and other env files (except `.env.example`)
- IDE/OS junk (`.vscode/`, `.idea/`, `.DS_Store`, etc.)
- Logs, lockfiles from other package managers (`yarn.lock`, `pnpm-lock.yaml`, `bun.lockb`)
- CI/security artifacts (`snyk.sarif`, `trivy-results.json`, `zap-*`, `summary.md`, `reports/`)
- Playwright/CI-generated files (`smoke.cjs`, `index_out.html`, `playwright-report/`, etc.)
- `.cursor/` (Cursor project state)

Do **commit** `package-lock.json` for reproducible `npm ci` installs.
