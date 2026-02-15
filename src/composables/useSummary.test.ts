import { QueryClient, VueQueryPlugin } from '@tanstack/vue-query'
import { flushPromises, mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { defineComponent, h } from 'vue'
import { useSummary } from './useSummary'

const { mockSummary } = vi.hoisted(() => ({
  mockSummary: {
    aum: [{ date: '2025-01-01', value: 1000000 }],
    pnl: [{ date: '2025-01-01', daily: 500, mtd: 1000, ytd: 5000, cumulative: 5000 }],
    var: [{ label: '95%', current: 12000, previous: 11500 }],
    trackingError: [{ date: '2025-01-01', te: 0.02, infoRatio: 1.5 }],
    exposures: [{ label: 'Equity', weight: 0.6 }],
    liquidity: [{ bucket: '1d', weight: 0.3 }],
  },
}))

vi.mock('@/api/summary', () => ({
  getSummary: vi.fn().mockResolvedValue(mockSummary),
}))

function mountWithQuery(setup: () => unknown) {
  const pinia = createPinia()
  setActivePinia(pinia)
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  })
  const Comp = defineComponent({
    setup,
    render: () => h('div'),
  })
  return mount(Comp, {
    global: { plugins: [pinia, [VueQueryPlugin, { queryClient }]] },
  })
}

afterEach(() => {
  vi.restoreAllMocks()
})

describe('useSummary', () => {
  it('fetches summary data for a portfolio', async () => {
    let result: ReturnType<typeof useSummary>
    mountWithQuery(() => {
      result = useSummary('p1')
    })
    await flushPromises()
    expect(result!.data.value).toEqual(mockSummary)
  })

  it('does not fetch when portfolioId is empty', async () => {
    let result: ReturnType<typeof useSummary>
    mountWithQuery(() => {
      result = useSummary('')
    })
    await flushPromises()
    expect(result!.fetchStatus.value).toBe('idle')
  })
})
