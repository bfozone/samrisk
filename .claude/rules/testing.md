---
paths:
  - "src/**/*.test.ts"
  - "vitest.config.ts"
  - "src/test-setup.ts"
---

# Testing

- Vitest + jsdom + `@testing-library/vue` + `@vue/test-utils` + MSW
- `@testing-library/jest-dom` matchers available globally via `src/test-setup.ts`
- Test files are co-located with source: `src/api/client.ts` -> `src/api/client.test.ts`
- Extension: `*.test.ts`
- Run all: `bun run test:run`
- Run single: `bun run vitest run src/api/client.test.ts`
- Run watch: `bun run test`

## Library choice by test type

- **Components/views:** `@testing-library/vue` (render, screen, userEvent)
- **Emits/slots/vm internals:** `@vue/test-utils` (mount)
- **Composables:** `@vue/test-utils` mount with wrapper component + MSW
- **Stores:** Pinia `setActivePinia(createPinia())`
- **API functions:** MSW `setupServer`
- **Pure functions/schemas:** direct import, no framework needed
