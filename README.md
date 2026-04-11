# OuroborosAI

React + Vite + TypeScript frontend for **OuroborosAI** — a Multi-Agent AI System for Scholarship Discovery & Application Assistance (NUS ISS Team 17). Uses React Router for navigation, **Axios** for HTTP (with JWT refresh), **TanStack Query** wired at the app root (available for future server-state), and **shadcn/ui** (Radix) + Tailwind CSS for UI.

## What's in the app

- **Auth**: Login and registration at `/login` with protected routes. The app talks to the **Ouroboros Orchestrator** backend: phone-based signup with OTP, login (username or phone + password), optional MFA, token refresh, and profile completion at `/profile/complete` when required.
- **Dashboard**: After login, users land on an agentic AI chat interface (Claude-style):
  - **Sidebar**: OuroborosAI branding, **New Chat**, **Starred** chats, **Projects** (folders with nested chats), **recent chats** grouped by date (unassigned only), nav (Profile, Programs, Scholarships, Applications), Settings / Assessments / Get Help, and a user block at the bottom (avatar, truncated name/email with tooltips, dropdown: Account, Billing, Log out).
  - **Chat**: Empty state with suggestion cards; message bubbles (user + assistant with markdown); typing indicator while the assistant responds; input bar with attach (UI) and send. Messages, stars, and projects are loaded from the **backend** (`/api/v1/chats`, `/api/v1/projects`).
  - **Pages**: Profile, Programs, Scholarships, Applications (card on mobile, table on desktop where applicable), Settings (including dark mode), Get Help, Assessments, Billing.
- **Theming**: Dark/light mode via `ThemeContext`; preference persisted in `localStorage`; Settings page can align with the same preference.
- **API**: Configurable via Vite env vars (`VITE_API_BASE_URL`, `VITE_API_VERSION`). HTTP calls use `src/api/client.ts` (base URL = orchestrator host; paths include `/api/v1/...`). Default base URL in dev: `http://localhost:8000`.

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

The app reads env vars via Vite (`import.meta.env`). Shared values are centralized in `src/config/env.ts` (including derived `API_URL` for logging and future use).

| Variable               | Description                          | Default                 |
|------------------------|--------------------------------------|-------------------------|
| `VITE_API_BASE_URL`    | Orchestrator backend base URL       | `http://localhost:8000` |
| `VITE_API_VERSION`     | API version segment (`/api/{ver}`) | `v1`                    |
| `VITE_APP_VERSION`     | Release label (CI sets from git tag) | empty in local dev      |

## Routing (React Router)

Defined in `src/App.tsx`:

| Route                       | Description                                      |
|-----------------------------|--------------------------------------------------|
| `/`                         | Redirects to `/dashboard`                        |
| `/login`                    | Login / Register (public)                        |
| `/profile/complete`         | Profile completion (protected, outside dashboard shell) |
| `/dashboard`                | Chat — new or empty conversation                 |
| `/dashboard/chat/:chatId`   | Existing conversation                            |
| `/dashboard/profile`        | Student profile                                  |
| `/dashboard/programs`       | Discovered programs                              |
| `/dashboard/scholarships`   | Matched scholarships                             |
| `/dashboard/applications`   | Application tracker                              |
| `/dashboard/settings`       | User settings (e.g. dark mode)                   |
| `/dashboard/help`          | Get Help                                         |
| `/dashboard/assessments`   | Assessments                                      |
| `/dashboard/billing`       | Billing                                          |
| `*`                         | 404 → NotFound                                   |

**Protected routes**: `ProtectedRoute` wraps authenticated routes, redirects to `/login` if unauthenticated, and to `/profile/complete` when the user must finish their profile. **`DashboardLayout`** wraps only `/dashboard/*` (sidebar + main + `ProjectProvider` + `ChatProvider`).

## Project structure

```
src/
  api/                    # Axios instance + API modules
    client.ts             # Base client, JWT attach/refresh, getErrorMessage
    authApi.ts
    chatsApi.ts           # Chats, messages, star, project assignment
    projectsApi.ts        # Projects CRUD
  components/
    auth/                 # Login, signup, OTP, MFA, profile completion, etc.
    chat/                 # ChatEmptyState, ChatInput, ChatMessages, MessageBubble, TypingIndicator
    dialogs/              # CreateProjectDialog, RenameProject/Chat dialogs
    layout/
      DashboardLayout.tsx # ProjectProvider → ChatProvider → sidebar shell
      AppSidebar.tsx
      DashboardHeader.tsx
      sidebar/            # StarredChats, ProjectList, ChatHistory
    ui/                   # shadcn/ui primitives
    ErrorBoundary.tsx
    LoadingSpinner.tsx
    ProtectedRoute.tsx
  config/
    env.ts
  contexts/
    AuthContext.tsx
    ChatContext.tsx       # Chats/messages; calls chatsApi
    ProjectContext.tsx    # Projects; calls projectsApi
    ThemeContext.tsx
  hooks/
    use-mobile.tsx
    use-toast.ts
  lib/
    utils.ts              # cn(), getInitials(), etc.
    mock-data.ts          # Placeholder (no mock chats; real API in use)
  pages/
    Login.tsx
    ChatPage.tsx
    ProfileComplete.tsx
    ProfilePage.tsx
    ProgramsPage.tsx
    ScholarshipsPage.tsx
    ApplicationsPage.tsx
    SettingsPage.tsx
    GetHelpPage.tsx
    AssessmentsPage.tsx
    BillingPage.tsx
    NotFound.tsx
  types/
    auth.ts
    chat.types.ts         # Chat, Message, Project types aligned with Orchestrator API
    api.types.ts
  utils/
    tokenStorage.ts
    dateUtils.ts
    phoneUtils.ts
  App.tsx
  main.tsx
  index.css
  vite-env.d.ts
```

## Backend integration (Orchestrator)

The UI expects the **Ouroboros Orchestrator** OpenAPI surface under `{VITE_API_BASE_URL}/api/v1`, including:

- **Chats**: create/list/get/patch/delete chat; list/send messages; filters for starred, `project_id`, `no_project`.
- **Projects**: create/list/get/patch/delete project; chats can be assigned or removed via chat `PATCH`.

Auth uses the same host for `/auth/*` and refresh as configured in `client.ts`.

## Error handling

The app uses a consistent error-handling pattern:

- **Context methods** (`ChatContext`, `ProjectContext`) wrap API calls in `try/catch`, update the context `error` state via `setError(getErrorMessage(err))`, and rethrow so callers can respond.
- **UI components** (sidebar actions, dialogs) catch errors from context methods and show **toast notifications** (via Sonner) with user-friendly messages.
- **Async clipboard** (`navigator.clipboard.writeText`) is awaited and wrapped in try/catch with success/error toasts.
- **Dialog forms** (create project, rename chat/project) show error toasts on failure and only close on success.

This ensures users receive immediate feedback on both success and failure without silent errors or unhandled promise rejections.

## Input validation

Client-side validation mirrors backend constraints (defined in `src/types/chat.types.ts`):

| Field                   | Max Length | Notes                                           |
|-------------------------|------------|-------------------------------------------------|
| Message content         | 10,000     | Character count shown when approaching limit    |
| Chat title              | 200        | Rename dialog enforces limit                    |
| Project name            | 100        | Create/rename dialogs enforce limit             |
| Project description     | 500        | Create dialog enforces limit                    |

All inputs are trimmed before submission. The send button and submit buttons are disabled when validation fails.

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
- TanStack Query (root `QueryClientProvider`; chat/projects use **React Context + Axios**)
- Axios (auth + chats + projects)
- Sonner (toast notifications)
- react-markdown, remark-gfm (chat messages)
- react-textarea-autosize (chat input)
- Vitest (unit tests; `passWithNoTests` enabled)

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
