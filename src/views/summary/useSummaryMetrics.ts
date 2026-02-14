import { computed } from 'vue'
import { useAnalyticsContext } from '@/stores/analytics'
import { useVaR, useExposures, useAuM, useTrackingError, usePnL, useLiquidity } from '@/composables/useRisk'
import { usePortfolioContext } from '@/composables/usePortfolioContext'
import { useAsOfDateFilter } from '@/composables/useAsOfDateFilter'
import {
  deriveAuMStat, derivePnLStat, deriveVaRStat, deriveTEStat,
  buildAuMChart, buildPnLChart, buildVaRChart, buildExposureChart, buildTEChart, buildLiquidityChart,
} from './config'

export function useSummaryMetrics() {
  const analytics = useAnalyticsContext()
  const portfolioId = computed(() => analytics.portfolioId ?? '')
  const { currency } = usePortfolioContext()
  const { byAsOfDate } = useAsOfDateFilter()

  const aum = useAuM(portfolioId)
  const pnl = usePnL(portfolioId)
  const varQ = useVaR(portfolioId)
  const te = useTrackingError(portfolioId)
  const exposure = useExposures(portfolioId)
  const liq = useLiquidity(portfolioId)

  // Time-series filtered by asOfDate
  const aumSeries = computed(() => byAsOfDate(aum.data.value ?? []))
  const pnlSeries = computed(() => byAsOfDate(pnl.data.value ?? []))
  const varSeries = computed(() => byAsOfDate(varQ.data.value ?? []))
  const teSeries = computed(() => byAsOfDate(te.data.value ?? []))

  // Stat cards - per-card loading/error
  const statCards = computed(() => [
    { ...deriveAuMStat(aumSeries.value, currency.value), loading: aum.isLoading.value, error: aum.isError.value },
    { ...derivePnLStat(pnlSeries.value, currency.value), loading: pnl.isLoading.value, error: pnl.isError.value },
    { ...deriveVaRStat(varSeries.value), loading: varQ.isLoading.value, error: varQ.isError.value },
    { ...deriveTEStat(teSeries.value), loading: te.isLoading.value, error: te.isError.value },
  ])

  // Chart cards - per-card loading/error/retry
  const chartCards = computed(() => [
    { title: 'AuM', preset: 'metricTrend' as const, config: buildAuMChart(aumSeries.value), loading: aum.isLoading.value, error: aum.isError.value, onRetry: aum.refetch },
    { title: 'Cumulative P&L', preset: 'pnlTrend' as const, config: buildPnLChart(pnlSeries.value), loading: pnl.isLoading.value, error: pnl.isError.value, onRetry: pnl.refetch },
    { title: 'Value at Risk', preset: 'riskTrend' as const, config: buildVaRChart(varSeries.value), overrides: { yAxis: { name: 'VaR (%)' } }, loading: varQ.isLoading.value, error: varQ.isError.value, onRetry: varQ.refetch },
    { title: 'Asset Allocation', preset: 'allocationDonut' as const, config: buildExposureChart(exposure.data.value ?? []), loading: exposure.isLoading.value, error: exposure.isError.value, onRetry: exposure.refetch },
    { title: 'Tracking Error & Info Ratio', preset: 'dualMetric' as const, config: buildTEChart(teSeries.value), overrides: { yAxis: [{ name: 'TE (%)' }, { name: 'Info Ratio' }] }, loading: te.isLoading.value, error: te.isError.value, onRetry: te.refetch },
    { title: 'Liquidity Profile', preset: 'liquidityProfile' as const, config: buildLiquidityChart(liq.data.value ?? []), loading: liq.isLoading.value, error: liq.isError.value, onRetry: liq.refetch },
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

  return { statCards, chartRows }
}
