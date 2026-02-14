---
name: test
description: Generate vitest tests for source files
argument-hint: <files, directories, or description>
disable-model-invocation: false
---

Generate vitest tests based on the following context:

$ARGUMENTS

## Resolve targets

Interpret the context to identify which source files need tests:
- File paths: test those files directly
- Directory paths: find all testable `.ts` and `.vue` files in that directory
- Descriptions (e.g. "the summary view", "all composables", "chart builders"): locate the matching source files
- Skip files that already have a `.test.ts` counterpart unless explicitly asked to regenerate

## For each target file

1. Read the source file to understand its exports, types, and behavior
2. Determine the file category (see below) and apply the matching pattern
3. Read the existing examples in [examples.md](examples.md) to match the project's test style
4. Create the test file co-located with the source: `{basename}.test.ts`
5. After generating all test files, run them with `bun run vitest run <paths>` and fix any failures

## File categories

### Pure functions (chart builders, format helpers, utils)
- Import directly, no mocking
- Test edge cases: empty input, single item, multiple items, boundary values
- Test each exported function

### Schema validation (valibot schemas)
- Use `expectValid()` / `expectInvalid()` helpers (see examples)
- Test valid data, invalid data, missing fields, boundary values

### API functions (`src/api/*.ts`)
- Use MSW `setupServer` with handlers from `@/mocks/handlers`
- Test successful responses and error handling
- Use `beforeAll/afterEach/afterAll` for server lifecycle

### Composables (`src/composables/*.ts`)
- These wrap Vue Query - test with a wrapper component that provides QueryClient
- Use `@vue/test-utils` `mount` with a small wrapper component that calls the composable
- Provide required plugins (QueryClient, Pinia) via `global.plugins`
- Use MSW for API layer - don't mock the composable internals
- Test reactive state transitions: loading -> success, loading -> error
- Use `flushPromises` from `@vue/test-utils` to await async state

### Vue components (`src/components/**/*.vue`, `src/views/**/*.vue`)
- Use `@testing-library/vue` `render` as the default for component tests
- Query by what users see: `getByRole`, `getByText`, `getByLabelText` - not CSS classes or data-testid
- Use `@testing-library/user-event` for interactions (`click`, `type`, `selectOptions`)
- Use `toBeInTheDocument()`, `toBeVisible()`, `toHaveTextContent()` from jest-dom matchers
- Provide required plugins via the `global` option on `render`
- Fall back to `@vue/test-utils` `mount` only when testing emits, slots, or `wrapper.vm` internals

### Pinia stores (`src/stores/*.ts`)
- Use `setActivePinia(createPinia())` in `beforeEach`
- Test actions and getters/computed, not internal state shape

## Rules

- Always `import { describe, expect, it } from 'vitest'`
- Use `@/` path alias for all project imports
- Co-locate: test file sits next to the source file
- Describe blocks per function or logical group
- `it` descriptions in present tense ("renders X", "handles Y", "rejects Z")
- Happy path first, edge cases second
- Use factory functions for complex test fixtures (see `makeAxiosError` example)
- No unused variables or imports (strict TS)
- Keep tests focused - don't test framework behavior or third-party internals
- Prefer Testing Library queries in this priority: `getByRole` > `getByLabelText` > `getByText` > `getByTestId`
- Use `screen` from Testing Library for queries after render
- Use `await userEvent.click()` not `fireEvent.click()` for realistic interaction
