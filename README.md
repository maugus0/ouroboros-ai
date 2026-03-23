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

- **Node.js**: 20+ (see `package.json` `engines`). For consistency with CI, use the version in `.nvmrc` (e.g. `nvm use`); CI uses Node **24** (see `.github/workflows/deploy.yml`).
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
| `index.html`       | Entry HTML; includes redirect handling for `?p=` deep links; build injects `__VITE_APP_VERSION__` from the tag in CI. |
| `.github/workflows/deploy.yml` | CI/CD: lint, tests, build artifact, security scans, Docker + Trivy (tag runs), deploy to gh-pages (**tag `v*` only**), **Verify Deployed Tag**, ZAP, summary. |

### Versioning & release flow

**What is the “real” production version?**  
The **git tag** `v*` (e.g. `v0.1.0`). Production builds set **`VITE_APP_VERSION`** from that tag so `index.html` exposes `<meta name="app-version" content="v0.1.0">` and the app can read **`APP_VERSION`** via `src/config/env.ts`.

**How releases work (manual tag — recommended here)**

1. Merge your changes into **`main`** (via PR as usual).
2. On the commit you want to ship (usually **tip of `main`**):

   ```bash
   git checkout main && git pull
   git tag v0.1.0          # semver; must not exist yet
   git push origin v0.1.0
   ```

3. GitHub Actions runs the pipeline for **`refs/tags/v*`**: build → deploy to GitHub Pages → **Verify Deployed Tag** (HTTP check that `ouroboros.chat` meta `app-version` equals the tag) → ZAP, etc.

**`package.json` `version` field**

- It is **not** auto-updated by CI pushing to `main` (that would conflict with **branch protection** requiring PRs).
- For a **private frontend** repo, it’s fine if **`package.json` version ≠ tag**; the live site version comes from the **tag at build time**.
- If you want them **in sync** (e.g. clarity, npm scripts, future publishing): bump **`version` in a normal PR** before or after tagging, or use a **bot/Changesets-style PR** — never rely on a bot **direct-pushing** `main` unless your org allows bypass.

**CI jobs to know**

| Job | Role |
|-----|------|
| **Build** (tag workflow) | Injects **`VITE_APP_VERSION`** = tag name. |
| **Deploy to ouroboros.chat** | Only on **`push` of tag `v*`** (not on every `main` push). |
| **Verify Deployed Tag** | After deploy, curls the live site and asserts **`<meta name="app-version">` === git tag** (sanity check, unrelated to `package.json`). |

**GitHub Code Scanning (optional):** Uploading SARIF to the Security tab requires **Code scanning** enabled under *Settings → Security → Code scanning*. Until then, ESLint/Snyk/Trivy SARIF is available as workflow **artifacts** (`eslint-sarif`, `snyk-sarif`, etc.). To also push SARIF to Code Scanning after enabling it, set repository Actions variable **`ENABLE_CODE_SCANNING_SARIF`** to `true`.

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
