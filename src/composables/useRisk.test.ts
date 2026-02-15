import { QueryClient, VueQueryPlugin } from '@tanstack/vue-query'
import { flushPromises, mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { defineComponent, h } from 'vue'
import { useAuM, useExposures, useLiquidity, usePnL, useTrackingError, useVaR } from './useRisk'

const { mockVaR, mockExposures, mockAuM, mockTE, mockPnL, mockLiquidity } = vi.hoisted(() => ({
  mockVaR: [{ label: '95%', current: 12000, previous: 11500 }],
  mockExposures: [{ label: 'Equity', weight: 0.6 }],
  mockAuM: [{ date: '2025-01-01', value: 1000000 }],
  mockTE: [{ date: '2025-01-01', te: 0.02, infoRatio: 1.5 }],
  mockPnL: [{ date: '2025-01-01', daily: 500, mtd: 1000, ytd: 5000, cumulative: 5000 }],
  mockLiquidity: [{ bucket: '1d', weight: 0.3 }],
}))

vi.mock('@/api/risk', () => ({
  getVaR: vi.fn().mockResolvedValue(mockVaR),
  getExposures: vi.fn().mockResolvedValue(mockExposures),
  getAuM: vi.fn().mockResolvedValue(mockAuM),
  getTrackingError: vi.fn().mockResolvedValue(mockTE),
  getPnL: vi.fn().mockResolvedValue(mockPnL),
  getLiquidity: vi.fn().mockResolvedValue(mockLiquidity),
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

describe('useVaR', () => {
  it('fetches VaR data', async () => {
    let result: ReturnType<typeof useVaR>
    mountWithQuery(() => {
      result = useVaR('p1')
    })
    await flushPromises()
    expect(result!.data.value).toEqual(mockVaR)
  })

  it('stays idle when portfolioId is empty', async () => {
    let result: ReturnType<typeof useVaR>
    mountWithQuery(() => {
      result = useVaR('')
    })
    await flushPromises()
    expect(result!.fetchStatus.value).toBe('idle')
  })
})

describe('useExposures', () => {
  it('fetches exposure data', async () => {
    let result: ReturnType<typeof useExposures>
    mountWithQuery(() => {
      result = useExposures('p1')
    })
    await flushPromises()
    expect(result!.data.value).toEqual(mockExposures)
  })
})

describe('useAuM', () => {
  it('fetches AuM data', async () => {
    let result: ReturnType<typeof useAuM>
    mountWithQuery(() => {
      result = useAuM('p1')
    })
    await flushPromises()
    expect(result!.data.value).toEqual(mockAuM)
  })
})

describe('useTrackingError', () => {
  it('fetches tracking error data', async () => {
    let result: ReturnType<typeof useTrackingError>
    mountWithQuery(() => {
      result = useTrackingError('p1')
    })
    await flushPromises()
    expect(result!.data.value).toEqual(mockTE)
  })
})

describe('usePnL', () => {
  it('fetches P&L data', async () => {
    let result: ReturnType<typeof usePnL>
    mountWithQuery(() => {
      result = usePnL('p1')
    })
    await flushPromises()
    expect(result!.data.value).toEqual(mockPnL)
  })
})

describe('useLiquidity', () => {
  it('fetches liquidity data', async () => {
    let result: ReturnType<typeof useLiquidity>
    mountWithQuery(() => {
      result = useLiquidity('p1')
    })
    await flushPromises()
    expect(result!.data.value).toEqual(mockLiquidity)
  })
})
