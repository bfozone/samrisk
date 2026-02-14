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
    const urlAsOf = to.query.asOf as string | undefined

    // Sync store from URL (URL takes precedence)
    if (urlId) analytics.selectPortfolio(urlId)
    if (urlAsOf) analytics.selectDate(urlAsOf)

    // Build desired params/query, then issue a single replace if needed
    const wantId = urlId || analytics.portfolioId
    const wantAsOf = urlAsOf || analytics.asOfDate

    const needsIdFill = !urlId && wantId
    const needsAsOfFill = !urlAsOf && wantAsOf

    if (needsIdFill || needsAsOfFill) {
      const params = wantId ? { portfolioId: wantId } : to.params
      const query = wantAsOf ? { ...to.query, asOf: wantAsOf } : to.query
      router.replace({ name: to.name!, params, query, hash: to.hash })
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
