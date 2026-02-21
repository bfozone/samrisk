import { onScopeDispose, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAnalyticsContext } from '@/stores/analytics'

export function useAnalyticsSync() {
  const router = useRouter()
  const route = useRoute()
  const analytics = useAnalyticsContext()

  const removeAfterEach = router.afterEach((to, from) => {
    if (!to.meta.analyticsRoute)
      return

    // Read URL state
    const urlId = to.params.portfolioId as string | undefined
    const urlAsOf
      = typeof to.query.asOf === 'string' ? to.query.asOf : undefined

    // Sync store from URL (URL takes precedence)
    if (urlId)
      analytics.selectPortfolio(urlId)
    if (urlAsOf) {
      // Explicit asOf in URL - adopt it
      if (analytics.asOfDate !== urlAsOf)
        analytics.selectDate(urlAsOf)
    }
    else if (from.meta.analyticsRoute && 'asOf' in from.query) {
      // Coming from an analytics route that had asOf, but new route doesn't -
      // user or code explicitly dropped it, so clear
      analytics.selectDate(null)
    }
    // Otherwise (no asOf in URL, previous route wasn't analytics or had no asOf):
    // keep the store date as-is

    // Build desired params, then issue a single replace if needed
    const wantId = urlId || analytics.portfolioId

    const needsIdFill = !urlId && wantId

    if (needsIdFill) {
      const params = wantId ? { portfolioId: wantId } : to.params
      router.replace({
        name: to.name!,
        params,
        query: to.query,
        hash: to.hash,
      })
    }
  })

  onScopeDispose(() => {
    removeAfterEach()
  })

  watch(
    () => analytics.portfolioId,
    (id) => {
      if (!route.meta.analyticsRoute || !id)
        return
      const currentId = route.params.portfolioId as string | undefined
      if (currentId !== id) {
        router.replace({
          name: route.name!,
          params: { portfolioId: id },
          query: route.query,
          hash: route.hash,
        })
      }
    },
  )

  watch(
    () => analytics.asOfDate,
    (asOf) => {
      if (!route.meta.analyticsRoute)
        return
      const currentAsOf = route.query.asOf as string | undefined
      if (asOf && currentAsOf !== asOf) {
        router.replace({
          name: route.name!,
          params: route.params,
          query: { ...route.query, asOf },
          hash: route.hash,
        })
      }
      else if (!asOf && currentAsOf) {
        const { asOf: _, ...rest } = route.query
        router.replace({
          name: route.name!,
          params: route.params,
          query: rest,
          hash: route.hash,
        })
      }
    },
  )
}
