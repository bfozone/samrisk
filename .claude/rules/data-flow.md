---
paths:
  - "src/api/**/*.ts"
  - "src/composables/**/*.ts"
  - "src/components/**/*.vue"
  - "src/views/**/*.vue"
  - "src/mocks/**/*.ts"
---

# Data Flow

- API functions in `src/api/` make Axios calls via the shared client (`src/api/client.ts`, base URL from `VITE_API_BASE_URL`)
- Vue Query composables in `src/composables/` wrap API functions with `useQuery`/`useMutation`
- Components consume composables - never call API functions directly
- One API file per domain (e.g. `auth.ts`, `risk.ts`, `portfolio.ts`)
- MSW mocks intercept requests in dev - check `src/mocks/handlers.ts` for available endpoints
- Mock API shapes should match expected FastAPI response schemas
