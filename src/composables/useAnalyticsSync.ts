import { onScopeDispose, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAnalyticsContext } from '@/stores/analytics'

export function useAnalyticsSync() {
  const router = useRouter()
  const route = useRoute()
  const analytics = useAnalyticsContext()

  const removeAfterEach = router.afterEach((to) => {
    if (!to.meta.analyticsRoute) return

    const urlId = to.params.portfolioId as string | undefined
    if (urlId) {
      analytics.selectPortfolio(urlId)
    } else if (analytics.portfolioId) {
      router.replace({ name: to.name!, params: { portfolioId: analytics.portfolioId }, query: to.query, hash: to.hash })
    }

    // Sync asOfDate from URL query param (URL takes precedence)
    const urlAsOf = to.query.asOf as string | undefined
    if (urlAsOf) {
      analytics.selectDate(urlAsOf)
    } else if (analytics.asOfDate) {
      router.replace({ name: to.name!, params: to.params, query: { ...to.query, asOf: analytics.asOfDate }, hash: to.hash })
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
