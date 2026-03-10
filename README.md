# SAMRisk

Financial risk dashboard - Vue 3 + TypeScript + Vite SPA.

Pre-production mockup with real patterns. MSW provides mock data so the app runs without a backend.

## Stack

| Layer | Tech |
|-------|------|
| Framework | Vue 3 (`<script setup>` + Composition API) |
| Components | shadcn-vue (Reka UI + Tailwind v4) |
| Charts | ECharts via vue-echarts |
| State | Pinia (app) + TanStack Vue Query (server) |
| HTTP | Ky (`src/api/client.ts`) |
| Auth | MSAL (Azure AD) - skipped in mock mode |
| Mocking | MSW browser handlers |
| Toast | vue-sonner |
| Build | Vite, Bun, TypeScript strict mode |
| Lint | ESLint (antfu config) + lint-staged |

## Requirements

- Bun 1.x

## Quick Start

```bash
bun install
bun run dev          # dev server with MSW mocks
```

## Scripts

```bash
bun run dev          # start Vite dev server
bun run build        # type-check + production build
bun run test         # vitest watch mode
bun run test:run     # vitest single run
bun run lint         # eslint check
bun run lint:fix     # eslint auto-fix
```

## Environment

| Variable | Default | Description |
|----------|---------|-------------|
| `VITE_API_BASE_URL` | `/api` | Backend API base URL |
| `VITE_USE_MOCK_API` | `true` | Set to `false` to use real backend + MSAL auth |

## Project Structure

```
src/
  api/              # HTTP request functions (one file per domain)
  assets/           # Global CSS: tokens.css, tailwind.css, main.css
  auth/             # MSAL config and token provider
  charts/           # ECharts option builders and presets
  components/
    ui/             # shadcn-vue components (owned, CLI-generated)
    base/           # Custom wrappers (AppIcon, AppDataTable, etc.)
    charts/         # Chart-specific components
  composables/      # Vue composables (useX pattern)
  layouts/          # Page layouts
  lib/              # Utilities (cn(), icon registry)
  mocks/            # MSW handlers and mock data
  plugins/          # ECharts theme registration
  stores/           # Pinia stores
  theme/            # Chart color palette
  types/            # Shared TypeScript interfaces
  utils/            # Standalone helpers (toast, formatting)
  views/            # Route-level page components
```

## Routes

| Section | Path | Status |
|---------|------|--------|
| - | `/` | Welcome page |
| Analytics | `/summary/:portfolioId?` | Implemented |
| Analytics | `/performance/:portfolioId?` | Placeholder |
| Analytics | `/market-risk/:portfolioId?` | Placeholder |
| Analytics | `/liquidity-risk/:portfolioId?` | Placeholder |
| Analytics | `/credit-risk/:portfolioId?` | Placeholder |
| Analytics | `/esg/:portfolioId?` | Placeholder |
| Monitoring | `/kri` | Placeholder |
| Compliance | `/guidelines/:portfolioId?` | Placeholder |
| Compliance | `/reports` | Placeholder |
| Master Data | `/product-master` | Placeholder |
| Master Data | `/security-master` | Placeholder |

Analytics routes share portfolio context via `stores/analytics.ts`, synced to URL params.

## UI System

Components live in two layers:

- **`src/components/ui/`** - shadcn-vue components. Owned code generated via CLI, styled with Tailwind utility classes. Add new ones with `npx shadcn-vue@latest add <name>`.
- **`src/components/base/`** - Custom wrappers for things shadcn doesn't cover: `AppIcon`, `AppDataTable` (TanStack Table), `AppSelect`, `AppCombobox`, `AppDateRangePicker`, `ValueCell`.

Theme tokens follow shadcn conventions (`--background`, `--foreground`, `--primary`, etc.) defined in `src/assets/tokens.css`. SAMRisk-specific tokens (`--color-positive`, `--color-negative`, chart colors, sidebar colors) coexist alongside.

## Container

```bash
docker compose up --build   # builds + serves on port 8080
```

Dockerfile uses Bun for build, Nginx for serving with SPA fallback.
