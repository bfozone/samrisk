# Test examples from this codebase

Real tests - match this style exactly.

## Pure function test (`src/charts/format.test.ts`)

```ts
import { describe, expect, it } from 'vitest'
import { axisFormatter, formatValue } from '@/charts/format'

describe('chart format helpers', () => {
  it('formats currency values with EUR prefix', () => {
    expect(formatValue(1_250_000, 'currency')).toBe('EUR 1.3M')
  })

  it('formats percent values with two decimals', () => {
    expect(formatValue(1.234, 'percent')).toBe('1.23%')
  })

  it('keeps percent axis labels compact', () => {
    expect(axisFormatter('percent')(12.5)).toBe('12.5%')
  })
})
```

## Schema validation test (`src/api/schemas.test.ts`)

Uses `expectValid` / `expectInvalid` helpers for DRY assertions:

```ts
import * as v from 'valibot'
import { describe, expect, it } from 'vitest'
import { PortfolioSchema, UserSchema } from './schemas'

function expectValid<T>(schema: v.GenericSchema<T>, data: unknown) {
  expect(() => v.parse(schema, data)).not.toThrow()
}

function expectInvalid<T>(schema: v.GenericSchema<T>, data: unknown) {
  expect(() => v.parse(schema, data)).toThrow()
}

describe('UserSchema', () => {
  it('accepts valid user', () => {
    expectValid(UserSchema, { id: '1', name: 'John', initials: 'JD', role: 'admin' })
  })

  it('rejects empty name', () => {
    expectInvalid(UserSchema, { id: '1', name: '', initials: 'JD', role: 'admin' })
  })

  it('rejects missing fields', () => {
    expectInvalid(UserSchema, { id: '1', name: 'John' })
  })
})
```

## Error classification with factory function (`src/api/client.test.ts`)

Factory function keeps fixture creation DRY:

```ts
import { AxiosError, AxiosHeaders } from 'axios'
import { describe, expect, it } from 'vitest'
import { classifyError } from './client'

function makeAxiosError(status?: number, headers?: Record<string, string>): AxiosError {
  const error = new AxiosError('test error')
  if (status !== undefined) {
    error.response = {
      status,
      statusText: 'Error',
      headers: headers ?? {},
      config: { headers: new AxiosHeaders() },
      data: null,
    }
  }
  return error
}

describe('classifyError', () => {
  it('classifies 401 as unauthorized', () => {
    expect(classifyError(makeAxiosError(401)).kind).toBe('unauthorized')
  })

  it('classifies no response as network', () => {
    expect(classifyError(makeAxiosError()).kind).toBe('network')
  })
})
```

## Chart config builder test (`src/views/summary/config.test.ts`)

Tests derived stats and chart config shapes:

```ts
import { describe, expect, it } from 'vitest'
import { buildAuMChart, deriveAuMStat } from './config'

describe('deriveAuMStat', () => {
  it('returns flat with dash for empty array', () => {
    const stat = deriveAuMStat([], 'EUR')
    expect(stat.value).toBe('-')
    expect(stat.trend).toBe('flat')
  })

  it('detects upward trend', () => {
    const stat = deriveAuMStat([
      { portfolioId: '1', date: '2025-01-01', aum: 100_000 },
      { portfolioId: '1', date: '2025-01-02', aum: 110_000 },
    ], 'EUR')
    expect(stat.trend).toBe('up')
  })
})

describe('buildAuMChart', () => {
  it('returns empty categories for empty input', () => {
    const config = buildAuMChart([], 'EUR')
    expect(config.categories).toEqual([])
    expect(config.series[0]!.data).toEqual([])
  })

  it('maps dates to categories and aum to series data', () => {
    const items = [
      { portfolioId: '1', date: '2025-01-01', aum: 100 },
      { portfolioId: '1', date: '2025-01-02', aum: 110 },
    ]
    const config = buildAuMChart(items, 'EUR')
    expect(config.categories).toEqual(['2025-01-01', '2025-01-02'])
    expect(config.series[0]!.data).toEqual([100, 110])
    expect(config.format).toBe('currency')
  })
})
```

## Component test with Testing Library

Default approach for component tests - query by role/text, interact with userEvent:

```ts
import userEvent from '@testing-library/user-event'
import { render, screen } from '@testing-library/vue'
import { describe, expect, it } from 'vitest'
import MyComponent from '@/components/MyComponent.vue'

describe('MyComponent', () => {
  it('renders the title', () => {
    render(MyComponent, { props: { title: 'Hello' } })
    expect(screen.getByText('Hello')).toBeInTheDocument()
  })

  it('calls handler on button click', async () => {
    const user = userEvent.setup()
    render(MyComponent, { props: { title: 'Hello' } })

    await user.click(screen.getByRole('button', { name: /submit/i }))

    expect(screen.getByText('Submitted')).toBeInTheDocument()
  })
})
```

## Component test with plugins (PrimeVue, Pinia, Router)

When a component depends on app-level plugins:

```ts
import { render, screen } from '@testing-library/vue'
import { createPinia } from 'pinia'
import PrimeVue from 'primevue/config'
import { describe, expect, it } from 'vitest'
import MyView from '@/views/MyView.vue'

describe('MyView', () => {
  it('renders dashboard content', () => {
    render(MyView, {
      global: {
        plugins: [PrimeVue, createPinia()],
      },
    })
    expect(screen.getByRole('heading', { name: /dashboard/i })).toBeInTheDocument()
  })
})
```

## Component test with Vue Test Utils (emits/slots)

Fall back to `mount` when testing component API internals:

```ts
import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import AppSelect from '@/components/AppSelect.vue'

describe('AppSelect', () => {
  it('emits update:modelValue on selection', async () => {
    const wrapper = mount(AppSelect, {
      props: { options: ['a', 'b'], modelValue: 'a' },
    })
    await wrapper.setValue('b')
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['b'])
  })
})
```

## Pinia store test

```ts
import { createPinia, setActivePinia } from 'pinia'
import { beforeEach, describe, expect, it } from 'vitest'
import { useAnalyticsStore } from '@/stores/analytics'

describe('analyticsStore', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('sets the active portfolio', () => {
    const store = useAnalyticsStore()
    store.setPortfolio('p1')
    expect(store.portfolioId).toBe('p1')
  })
})
```

## Composable test with wrapper component

Test composables by mounting a small wrapper that calls them:

```ts
import { QueryClient, VueQueryPlugin } from '@tanstack/vue-query'
import { flushPromises, mount } from '@vue/test-utils'
import { setupServer } from 'msw/node'
import { afterAll, afterEach, beforeAll, describe, expect, it } from 'vitest'
import { defineComponent } from 'vue'
import { usePortfolios } from '@/composables/usePortfolios'
import { handlers } from '@/mocks/handlers'

const server = setupServer(...handlers)
beforeAll(() => server.listen())
afterEach(() => server.resetHandlers())
afterAll(() => server.close())

const queryClient = new QueryClient({
  defaultOptions: { queries: { retry: false } },
})

const Wrapper = defineComponent({
  setup() {
    const result = usePortfolios()
    return { result }
  },
  template: '<div />',
})

describe('usePortfolios', () => {
  it('fetches portfolio list', async () => {
    const wrapper = mount(Wrapper, {
      global: {
        plugins: [[VueQueryPlugin, { queryClient }]],
      },
    })
    await flushPromises()
    expect(wrapper.vm.result.data.value).toBeDefined()
  })
})
```

## API function test with MSW

```ts
import { setupServer } from 'msw/node'
import { afterAll, afterEach, beforeAll, describe, expect, it } from 'vitest'
import { fetchPortfolios } from '@/api/portfolio'
import { handlers } from '@/mocks/handlers'

const server = setupServer(...handlers)
beforeAll(() => server.listen())
afterEach(() => server.resetHandlers())
afterAll(() => server.close())

describe('fetchPortfolios', () => {
  it('returns parsed portfolio list', async () => {
    const portfolios = await fetchPortfolios()
    expect(portfolios).toBeInstanceOf(Array)
    expect(portfolios[0]).toHaveProperty('id')
  })
})
```
