import { computed } from 'vue'
import { useAnalyticsContext } from '@/stores/analytics'
import { usePortfolios } from './usePortfolios'

export function usePortfolioContext() {
  const analytics = useAnalyticsContext()
  const { data: portfolios } = usePortfolios()

  const selectedPortfolio = computed(
    () => portfolios.value?.find(p => p.id === analytics.portfolioId) ?? null,
  )

  const currency = computed(() => selectedPortfolio.value?.currency ?? 'EUR')

  return { selectedPortfolio, currency }
}
