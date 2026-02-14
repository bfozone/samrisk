import { onScopeDispose, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAnalyticsContext } from '@/stores/analytics'

export function useAnalyticsSync() {
  const router = useRouter()
  const route = useRoute()
  const analytics = useAnalyticsContext()

  const removeAfterEach = router.afterEach((to) => {
    if (!to.meta.analyticsRoute) return

    // Read URL state
    const urlId = to.params.portfolioId as string | undefined
    const urlAsOf = typeof to.query.asOf === 'string' ? to.query.asOf : undefined

    // Sync store from URL (URL takes precedence)
    if (urlId) analytics.selectPortfolio(urlId)
    if (analytics.asOfDate !== (urlAsOf ?? null)) {
      analytics.selectDate(urlAsOf ?? null)
    }

    // Build desired params, then issue a single replace if needed
    const wantId = urlId || analytics.portfolioId

    const needsIdFill = !urlId && wantId

    if (needsIdFill) {
      const params = wantId ? { portfolioId: wantId } : to.params
      router.replace({ name: to.name!, params, query: to.query, hash: to.hash })
    }
  })

  onScopeDispose(() => {
    removeAfterEach()
  })

  watch(
    () => analytics.portfolioId,
    (id) => {
      if (!route.meta.analyticsRoute || !id) return
      const currentId = route.params.portfolioId as string | undefined
      if (currentId !== id) {
        router.replace({ name: route.name!, params: { portfolioId: id }, query: route.query, hash: route.hash })
      }
    },
  )

  watch(
    () => analytics.asOfDate,
    (asOf) => {
      if (!route.meta.analyticsRoute) return
      const currentAsOf = route.query.asOf as string | undefined
      if (asOf && currentAsOf !== asOf) {
        router.replace({ name: route.name!, params: route.params, query: { ...route.query, asOf }, hash: route.hash })
      } else if (!asOf && currentAsOf) {
        const { asOf: _, ...rest } = route.query
        router.replace({ name: route.name!, params: route.params, query: rest, hash: route.hash })
      }
    },
  )
}
