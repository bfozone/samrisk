# RiskCog Mockup App

Skeleton frontend for a future production risk/portfolio application.

## Purpose

- Provide a realistic UI shell and interaction model before backend APIs exist.
- Validate layout, navigation, charting, and component patterns.
- Keep development unblocked using mocked API responses via MSW.

## Tech Stack

- Vue 3 + TypeScript + Vite
- Pinia for app state
- Vue Router
- TanStack Query for data fetching
- PrimeVue + custom theme preset
- ECharts for charts
- MSW for browser API mocking

## Requirements

- Bun 1.x

## Local Development

```bash
bun install
bun run dev
```

The app runs with mock API handlers in development mode. No real backend is required.

## Scripts

```bash
bun run dev        # start Vite dev server
bun run build      # typecheck + production build
bun run preview    # preview production build locally
bun run test       # run Vitest in watch mode
bun run test:run   # single Vitest run (passes if no tests exist yet)
```

## Environment

Copy `.env.example` and adjust as needed:

- `VITE_API_BASE_URL` (default `/api`)

## Routing Status

Currently implemented views:

- `/` (Welcome)
- `/dashboard/:portfolioId?` (Dashboard mock charts)
- `/:pathMatch(.*)*` (Not Found)

Some sidebar links are intentional placeholders and currently route to 404 until corresponding pages are implemented.

## API Error Handling Strategy

`src/api/client.ts` contains centralized axios response error handling with configurable hooks for:

- `401` unauthorized
- `403` forbidden
- `5xx` server errors
- network errors
- unknown API errors

You can connect this to future auth refresh/login redirect and toast/notification systems using `configureApiErrorHandlers(...)`.

## Container Build

The repo includes:

- `Dockerfile` for build + nginx runtime image
- `docker-compose.yml` for local container run
- `nginx.conf` with SPA fallback and static asset caching
