<script setup lang="ts">
import { computed } from 'vue'
import { useAnalyticsContext } from '@/stores/analytics'
import PresetChartCard from '@/components/charts/PresetChartCard.vue'
import StatCard from '@/components/StatCard.vue'
import DashboardGrid from '@/components/DashboardGrid.vue'
import { useVaR, useExposures, useAuM, useTrackingError, usePnL, useLiquidity } from '@/composables/useRisk'
import { formatValue, type LineChartConfig, type PieChartConfig, type BarChartConfig } from '@/charts'

const analytics = useAnalyticsContext()
const portfolioId = computed(() => analytics.portfolioId ?? '')

const { data: varData, isLoading: varLoading, isError: varError, refetch: varRefetch } = useVaR(portfolioId)
const { data: exposureData, isLoading: exposureLoading, isError: exposureError, refetch: exposureRefetch } = useExposures(portfolioId)
const { data: aumData, isLoading: aumLoading, isError: aumError, refetch: aumRefetch } = useAuM(portfolioId)
const { data: teData, isLoading: teLoading, isError: teError, refetch: teRefetch } = useTrackingError(portfolioId)
const { data: pnlData, isLoading: pnlLoading, isError: pnlError, refetch: pnlRefetch } = usePnL(portfolioId)
const { data: liqData, isLoading: liqLoading, isError: liqError, refetch: liqRefetch } = useLiquidity(portfolioId)

const anyLoading = computed(() =>
  aumLoading.value
  || pnlLoading.value
  || varLoading.value
  || teLoading.value
  || exposureLoading.value
  || liqLoading.value,
)

const anyError = computed(() =>
  aumError.value
  || pnlError.value
  || varError.value
  || teError.value,
)

function byAsOfDate<T extends { date: string }>(items: T[]): T[] {
  const asOfDate = analytics.asOfDate
  if (!asOfDate) return items
  return items.filter((item) => item.date <= asOfDate)
}

const aumSeries = computed(() => byAsOfDate(aumData.value ?? []))
const pnlSeries = computed(() => byAsOfDate(pnlData.value ?? []))
const varSeries = computed(() => byAsOfDate(varData.value ?? []))
const teSeries = computed(() => byAsOfDate(teData.value ?? []))

// --- Formatters (stat cards only) ---

function fmtPct(v: number): string {
  return `${v >= 0 ? '+' : ''}${v.toFixed(2)}%`
}

// --- Stat cards ---

const aumStat = computed(() => {
  const items = aumSeries.value
  if (items.length < 2) return { value: '-', change: '', trend: 'flat' as const }
  const latest = items[items.length - 1]!
  const prev = items[items.length - 2]!
  const pctChange = ((latest.aum - prev.aum) / prev.aum) * 100
  return {
    value: formatValue(latest.aum, 'currency'),
    change: fmtPct(pctChange),
    trend: pctChange > 0.01 ? 'up' as const : pctChange < -0.01 ? 'down' as const : 'flat' as const,
  }
})

const pnlStat = computed(() => {
  const items = pnlSeries.value
  if (!items.length) return { value: '-', change: '', trend: 'flat' as const }
  const latest = items[items.length - 1]!
  const v = latest.daily
  return {
    value: `${v >= 0 ? '+' : ''}${formatValue(v, 'currency')}`,
    change: `MTD ${formatValue(latest.mtd, 'currency')}`,
    trend: v > 0 ? 'up' as const : v < 0 ? 'down' as const : 'flat' as const,
  }
})

const varStat = computed(() => {
  const items = varSeries.value
  if (items.length < 2) return { value: '-', change: '', trend: 'flat' as const }
  const latest = items[items.length - 1]!
  const prev = items[items.length - 2]!
  const diff = latest.var95 - prev.var95
  return {
    value: `${latest.var95.toFixed(2)}%`,
    change: fmtPct(diff),
    trend: diff > 0.01 ? 'up' as const : diff < -0.01 ? 'down' as const : 'flat' as const,
  }
})

const teStat = computed(() => {
  const items = teSeries.value
  if (!items.length) return { value: '-', change: '', trend: 'flat' as const }
  const latest = items[items.length - 1]!
  return {
    value: `${latest.te.toFixed(2)}%`,
    change: `IR ${latest.infoRatio.toFixed(2)}`,
    trend: latest.infoRatio > 0 ? 'up' as const : latest.infoRatio < 0 ? 'down' as const : 'flat' as const,
  }
})

// --- Charts ---

const aumChartConfig = computed<LineChartConfig>(() => {
  const items = aumSeries.value
  return {
    categories: items.map((d) => d.date),
    series: [{ name: 'AuM', data: items.map((d) => d.aum), area: true }],
    format: 'currency',
  }
})

const pnlChartConfig = computed<Omit<LineChartConfig, 'zeroLine'>>(() => {
  const items = pnlSeries.value
  return {
    categories: items.map((d) => d.date),
    series: [{ name: 'Cumulative P&L', data: items.map((d) => d.cumulative) }],
    format: 'currency',
  }
})

const varChartConfig = computed<LineChartConfig>(() => {
  const items = varSeries.value
  return {
    categories: items.map((d) => d.date),
    series: [
      { name: 'VaR 95%', data: items.map((d) => d.var95) },
      { name: 'VaR 99%', data: items.map((d) => d.var99) },
    ],
  }
})

const exposureChartConfig = computed<PieChartConfig>(() => {
  const items = exposureData.value ?? []
  return {
    data: items.map((d) => ({ value: d.percentage, name: d.category })),
  }
})

const teChartConfig = computed<LineChartConfig>(() => {
  const items = teSeries.value
  return {
    categories: items.map((d) => d.date),
    series: [
      { name: 'Tracking Error', data: items.map((d) => d.te) },
      { name: 'Info Ratio', data: items.map((d) => d.infoRatio), yAxisIndex: 1 },
    ],
    format: 'percent',
    rightFormat: 'number',
  }
})

const liqChartConfig = computed<Omit<BarChartConfig, 'horizontal'>>(() => {
  const items = liqData.value ?? []
  return {
    categories: items.map((d) => d.horizon),
    series: [{ name: 'Liquidity', data: items.map((d) => d.percentage) }],
    format: 'percent',
  }
})
</script>

<template>
  <div class="dashboard">
    <template v-if="analytics.hasPortfolio">
      <!-- KPI cards -->
      <DashboardGrid :columns="4" gap="md">
        <StatCard label="AuM" :value="aumStat.value" :change="aumStat.change" :trend="aumStat.trend" :loading="anyLoading" :error="anyError" />
        <StatCard label="Daily P&L" :value="pnlStat.value" :change="pnlStat.change" :trend="pnlStat.trend" :loading="anyLoading" :error="anyError" />
        <StatCard label="VaR 95%" :value="varStat.value" :change="varStat.change" :trend="varStat.trend" :loading="anyLoading" :error="anyError" />
        <StatCard label="Tracking Error" :value="teStat.value" :change="teStat.change" :trend="teStat.trend" :loading="anyLoading" :error="anyError" />
      </DashboardGrid>

      <!-- AuM + P&L -->
      <DashboardGrid>
        <PresetChartCard title="AuM" preset="metricTrend" :config="aumChartConfig" :loading="aumLoading" :error="aumError" :on-retry="aumRefetch" />
        <PresetChartCard title="Cumulative P&L" preset="pnlTrend" :config="pnlChartConfig" :loading="pnlLoading" :error="pnlError" :on-retry="pnlRefetch" />
      </DashboardGrid>

      <!-- VaR + Allocation -->
      <DashboardGrid>
        <PresetChartCard
          title="Value at Risk"
          preset="riskTrend"
          :config="varChartConfig"
          :overrides="{ yAxis: { name: 'VaR (%)' } }"
          :loading="varLoading"
          :error="varError"
          :on-retry="varRefetch"
        />
        <PresetChartCard title="Asset Allocation" preset="allocationDonut" :config="exposureChartConfig" :loading="exposureLoading" :error="exposureError" :on-retry="exposureRefetch" />
      </DashboardGrid>

      <!-- TE + Liquidity -->
      <DashboardGrid>
        <PresetChartCard
          title="Tracking Error & Info Ratio"
          preset="dualMetric"
          :config="teChartConfig"
          :overrides="{ yAxis: [{ name: 'TE (%)' }, { name: 'Info Ratio' }] }"
          :loading="teLoading"
          :error="teError"
          :on-retry="teRefetch"
        />
        <PresetChartCard title="Liquidity Profile" preset="liquidityProfile" :config="liqChartConfig" :loading="liqLoading" :error="liqError" :on-retry="liqRefetch" />
      </DashboardGrid>
    </template>
    <div v-else class="analytics-empty-state">
      <i class="pi pi-briefcase" />
      <p>Select a portfolio from the topbar to view summary analytics</p>
    </div>
  </div>
</template>
