import { computed } from 'vue'
import { usePortfolioContext } from '@/composables/usePortfolioContext'
import { useSummary } from '@/composables/useSummary'
import { useAnalyticsContext } from '@/stores/analytics'
import {
  deriveCreditStat,
  deriveEsgStat,
  deriveLiquidityStat,
  derivePerformanceStat,
  deriveVaRStat,
} from './config'

export function useSummaryMetrics() {
  const analytics = useAnalyticsContext()
  const portfolioId = computed(() => analytics.portfolioId ?? '')
  const { selectedPortfolio, currency } = usePortfolioContext()

  const { data, isLoading, isError, refetch } = useSummary(portfolioId)

  const varSeries = computed(() => data.value?.var ?? [])
  const performanceSeries = computed(() => data.value?.performance ?? [])
  const pnlSeries = computed(() => data.value?.pnl ?? [])
  const liquiditySeries = computed(() => data.value?.liquidity ?? [])

  const exposures = computed(() =>
    (data.value?.exposures ?? []).map(e => ({ name: e.category, percentage: e.percentage })),
  )

  const statCards = computed(() => [
    { ...derivePerformanceStat(performanceSeries.value, pnlSeries.value, currency.value), to: '/performance', loading: isLoading.value, error: isError.value, onRetry: refetch },
    { ...deriveVaRStat(varSeries.value), to: '/market-risk', loading: isLoading.value, error: isError.value, onRetry: refetch },
    { ...deriveLiquidityStat(liquiditySeries.value), to: '/liquidity-risk', loading: isLoading.value, error: isError.value, onRetry: refetch },
    { ...deriveCreditStat(), to: '/credit-risk', loading: isLoading.value, error: isError.value, onRetry: refetch },
    { ...deriveEsgStat(), to: '/esg', loading: isLoading.value, error: isError.value, onRetry: refetch },
  ])

  const latestVar95 = computed(() => {
    const items = varSeries.value
    return items.length ? items.at(-1)!.var95 : null
  })

  return {
    portfolio: selectedPortfolio,
    isLoading,
    isError,
    refetch,
    exposures,
    statCards,
    latestVar95,
  }
}
