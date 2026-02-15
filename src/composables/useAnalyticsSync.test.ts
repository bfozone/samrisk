import { flushPromises, mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { defineComponent, h, nextTick } from 'vue'
import { createMemoryHistory, createRouter } from 'vue-router'
import { useAnalyticsContext } from '@/stores/analytics'
import { useAnalyticsSync } from './useAnalyticsSync'

function createTestRouter() {
  return createRouter({
    history: createMemoryHistory(),
    routes: [
      { path: '/', name: 'home', component: { render: () => h('div') } },
      {
        path: '/summary/:portfolioId?',
        name: 'summary',
        meta: { analyticsRoute: true },
        component: { render: () => h('div') },
      },
      {
        path: '/performance/:portfolioId?',
        name: 'performance',
        meta: { analyticsRoute: true },
        component: { render: () => h('div') },
      },
    ],
  })
}

function mountWithSync(router: ReturnType<typeof createTestRouter>) {
  const pinia = createPinia()
  setActivePinia(pinia)
  const Comp = defineComponent({
    setup() {
      useAnalyticsSync()
    },
    render: () => h('div'),
  })
  return mount(Comp, {
    global: { plugins: [pinia, router] },
  })
}

describe('useAnalyticsSync', () => {
  let router: ReturnType<typeof createTestRouter>

  beforeEach(async () => {
    router = createTestRouter()
    await router.push('/')
    await router.isReady()
  })

  afterEach(() => {
    localStorage.clear()
  })

  it('syncs portfolio ID from URL to store', async () => {
    mountWithSync(router)
    await router.push('/summary/fund-1')
    await flushPromises()
    const analytics = useAnalyticsContext()
    expect(analytics.portfolioId).toBe('fund-1')
  })

  it('syncs asOf from URL query to store', async () => {
    mountWithSync(router)
    await router.push('/summary/fund-1?asOf=2025-01-15')
    await flushPromises()
    const analytics = useAnalyticsContext()
    expect(analytics.asOfDate).toBe('2025-01-15')
  })

  it('fills missing portfolioId from store', async () => {
    mountWithSync(router)
    const analytics = useAnalyticsContext()
    analytics.selectPortfolio('fund-1')
    await router.push({ name: 'summary' })
    await flushPromises()
    expect(router.currentRoute.value.params.portfolioId).toBe('fund-1')
  })

  it('updates URL when store portfolioId changes', async () => {
    mountWithSync(router)
    await router.push('/summary/fund-1')
    await flushPromises()
    const analytics = useAnalyticsContext()
    analytics.selectPortfolio('fund-2')
    await nextTick()
    await flushPromises()
    expect(router.currentRoute.value.params.portfolioId).toBe('fund-2')
  })

  it('updates URL query when store asOfDate changes', async () => {
    mountWithSync(router)
    await router.push('/summary/fund-1')
    await flushPromises()
    const analytics = useAnalyticsContext()
    analytics.selectDate('2025-06-01')
    await nextTick()
    await flushPromises()
    expect(router.currentRoute.value.query.asOf).toBe('2025-06-01')
  })

  it('removes asOf from URL when store date is cleared', async () => {
    mountWithSync(router)
    await router.push('/summary/fund-1?asOf=2025-01-15')
    await flushPromises()
    const analytics = useAnalyticsContext()
    analytics.selectDate(null)
    await nextTick()
    await flushPromises()
    expect(router.currentRoute.value.query.asOf).toBeUndefined()
  })

  it('ignores non-analytics routes', async () => {
    mountWithSync(router)
    const analytics = useAnalyticsContext()
    analytics.selectPortfolio('fund-1')
    await router.push('/')
    await flushPromises()
    // Should not have added portfolioId to home route
    expect(router.currentRoute.value.params.portfolioId).toBeUndefined()
  })
})
