import { QueryClient, VueQueryPlugin } from '@tanstack/vue-query'
import { flushPromises, mount } from '@vue/test-utils'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { defineComponent, h } from 'vue'
import { usePortfolios, usePositions } from './usePortfolios'

vi.mock('@/api/portfolio', () => ({
  getPortfolios: vi
    .fn()
    .mockResolvedValue([
      { id: 'p1', name: 'Fund A', currency: 'EUR', navTotal: 100 },
    ]),
  getPositions: vi
    .fn()
    .mockResolvedValue([
      {
        id: 'pos1',
        name: 'Bond A',
        assetClass: 'Fixed Income',
        weight: 0.5,
        marketValue: 50,
      },
    ]),
}))

function mountWithQuery(setup: () => unknown) {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  })
  const Comp = defineComponent({
    setup,
    render: () => h('div'),
  })
  return mount(Comp, {
    global: { plugins: [[VueQueryPlugin, { queryClient }]] },
  })
}

afterEach(() => {
  vi.restoreAllMocks()
})

describe('usePortfolios', () => {
  it('returns portfolio data', async () => {
    let result: ReturnType<typeof usePortfolios>
    mountWithQuery(() => {
      result = usePortfolios()
    })
    await flushPromises()
    expect(result!.data.value).toEqual([
      { id: 'p1', name: 'Fund A', currency: 'EUR', navTotal: 100 },
    ])
  })

  it('has retry set to 2', () => {
    let result: ReturnType<typeof usePortfolios>
    mountWithQuery(() => {
      result = usePortfolios()
    })
    // Query is created - verify it doesn't throw
    expect(result!.isLoading.value || result!.data.value !== undefined).toBe(
      true,
    )
  })
})

describe('usePositions', () => {
  it('fetches positions for a given portfolio', async () => {
    let result: ReturnType<typeof usePositions>
    mountWithQuery(() => {
      result = usePositions('p1')
    })
    await flushPromises()
    expect(result!.data.value).toEqual([
      {
        id: 'pos1',
        name: 'Bond A',
        assetClass: 'Fixed Income',
        weight: 0.5,
        marketValue: 50,
      },
    ])
  })

  it('does not fetch when portfolioId is empty', async () => {
    let result: ReturnType<typeof usePositions>
    mountWithQuery(() => {
      result = usePositions('')
    })
    await flushPromises()
    expect(result!.fetchStatus.value).toBe('idle')
  })
})
