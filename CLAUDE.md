# SAMRisk

Financial risk dashboard - Vue 3 + TypeScript + Vite SPA.

**This is a pre-job mockup that will become the real production app.** Every pattern, abstraction, and structure choice should be production-worthy - no throwaway code.

## Commands

```bash
bun install          # install dependencies
bun run dev          # start dev server (MSW mocks enabled)
bun run build        # type-check + production build
bun run test         # run vitest in watch mode
bun run test:run     # run vitest once
```

Docker build uses Bun, serves via Nginx on port 8080.

## Stack

- **UI:** shadcn-vue (Reka UI primitives + Tailwind) + ECharts via vue-echarts
- **Components:** `src/components/ui/` (shadcn-vue, owned code) + `src/components/base/` (custom wrappers)
- **State:** Pinia (app store) + TanStack Vue Query (server state)
- **API:** Ky client (`src/api/client.ts`), base URL from `VITE_API_BASE_URL`
- **Mocking:** MSW handlers in `src/mocks/handlers.ts` - auto-enabled in dev mode
- **Theme:** shadcn CSS variables in `src/assets/tokens.css`, Tailwind config in `src/assets/tailwind.css`
- **Toast:** vue-sonner (Toaster in DefaultLayout, `addToast()` from `src/utils/toastRef.ts`)
- **Backend (future):** FastAPI + Dagster + Trino/Iceberg datalake - frontend consumes REST endpoints only

## Code style

- Vue 3 `<script setup lang="ts">` for all components
- Composition API only - no Options API
- Path alias `@/` maps to `src/`
- Strict TypeScript - no unused vars/params allowed

## Project structure

- `src/api/` - Ky request functions (one file per domain)
- `src/components/` - Reusable components
- `src/composables/` - Vue composables (useX pattern)
- `src/layouts/` - Page layouts
- `src/views/` - Route-level page components
- `src/stores/` - Pinia stores
- `src/types/` - Shared TypeScript interfaces
- `src/theme/` - Chart color palette

## Routes

Three sidebar sections reflecting the domain structure:

- **Analytics:** `/summary`, `/performance`, `/market-risk`, `/liquidity-risk`, `/credit-risk`, `/esg` (all portfolio-scoped with optional `:portfolioId` param)
- **Monitoring:** `/kri` (KRI dashboard)
- **Compliance:** `/guidelines` (portfolio-scoped), `/reports`
- **Master Data:** `/product-master`, `/security-master`
- **Other:** `/` (welcome)

All Analytics views share a portfolio context managed by `stores/analytics.ts` and synced to URL params via `composables/useAnalyticsSync.ts`. The topbar shows portfolio and date selectors on analytics routes.

## Status

- `/` (welcome) and `/summary` have content - all other views are placeholder shells
