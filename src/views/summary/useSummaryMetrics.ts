import { computed } from 'vue'
import { usePortfolioContext } from '@/composables/usePortfolioContext'
import { useSummary } from '@/composables/useSummary'
import { useAnalyticsContext } from '@/stores/analytics'
import {
  buildAuMChart,
  buildExposureChart,
  buildLiquidityChart,
  buildPnLChart,
  buildTEChart,
  buildVaRChart,
  deriveAuMStat,
  derivePnLStat,
  deriveTEStat,
  deriveVaRStat,
} from './config'

export function useSummaryMetrics() {
  const analytics = useAnalyticsContext()
  const portfolioId = computed(() => analytics.portfolioId ?? '')
  const { currency } = usePortfolioContext()

  const { data, isLoading, isError, refetch } = useSummary(portfolioId)

  const aumSeries = computed(() => data.value?.aum ?? [])
  const pnlSeries = computed(() => data.value?.pnl ?? [])
  const varSeries = computed(() => data.value?.var ?? [])
  const teSeries = computed(() => data.value?.trackingError ?? [])

  // Stat cards - unified loading/error from single query
  const statCards = computed(() => [
    { ...deriveAuMStat(aumSeries.value, currency.value), loading: isLoading.value, error: isError.value },
    { ...derivePnLStat(pnlSeries.value, currency.value), loading: isLoading.value, error: isError.value },
    { ...deriveVaRStat(varSeries.value), loading: isLoading.value, error: isError.value },
    { ...deriveTEStat(teSeries.value), loading: isLoading.value, error: isError.value },
  ])

  // Chart cards - unified loading/error/retry from single query
  const chartCards = computed(() => [
    { title: 'AuM', preset: 'metricTrend' as const, config: buildAuMChart(aumSeries.value, currency.value), loading: isLoading.value, error: isError.value, onRetry: refetch },
    { title: 'Cumulative P&L', preset: 'pnlTrend' as const, config: buildPnLChart(pnlSeries.value, currency.value), loading: isLoading.value, error: isError.value, onRetry: refetch },
    { title: 'Value at Risk', preset: 'riskTrend' as const, config: buildVaRChart(varSeries.value), overrides: { yAxis: { name: 'VaR (%)' } }, loading: isLoading.value, error: isError.value, onRetry: refetch },
    { title: 'Asset Allocation', preset: 'allocationDonut' as const, config: buildExposureChart(data.value?.exposures ?? []), loading: isLoading.value, error: isError.value, onRetry: refetch },
    { title: 'Tracking Error & Info Ratio', preset: 'dualMetric' as const, config: buildTEChart(teSeries.value), overrides: { yAxis: [{ name: 'TE (%)' }, { name: 'Info Ratio' }] }, loading: isLoading.value, error: isError.value, onRetry: refetch },
    { title: 'Liquidity Profile', preset: 'liquidityProfile' as const, config: buildLiquidityChart(data.value?.liquidity ?? []), loading: isLoading.value, error: isError.value, onRetry: refetch },
  ])

  // Group chart cards into rows of 2
  const chartRows = computed(() => {
    const cards = chartCards.value
    const rows: (typeof cards)[] = []
    for (let i = 0; i < cards.length; i += 2) {
      rows.push(cards.slice(i, i + 2))
    }
    return rows
  })

  const latestVar95 = computed(() => {
    const items = varSeries.value
    return items.length ? items.at(-1)!.var95 : null
  })

  return { statCards, chartRows, latestVar95 }
}
