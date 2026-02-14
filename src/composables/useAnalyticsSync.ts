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
}
