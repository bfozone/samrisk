<script setup lang="ts">
import { computed } from 'vue'
import { useAnalyticsContext } from '@/stores/analytics'
import ChartCard from '@/components/ChartCard.vue'
import StatCard from '@/components/StatCard.vue'
import { useVaR, useExposures, useAuM, useTrackingError, usePnL, useLiquidity } from '@/composables/useRisk'
import { lineChart, barChart, pieChart, formatValue } from '@/charts'

const analytics = useAnalyticsContext()
const portfolioId = computed(() => analytics.portfolioId ?? '')

const { data: varData, isLoading: varLoading } = useVaR(portfolioId)
const { data: exposureData, isLoading: exposureLoading } = useExposures(portfolioId)
const { data: aumData, isLoading: aumLoading } = useAuM(portfolioId)
const { data: teData, isLoading: teLoading } = useTrackingError(portfolioId)
const { data: pnlData, isLoading: pnlLoading } = usePnL(portfolioId)
const { data: liqData, isLoading: liqLoading } = useLiquidity(portfolioId)

const anyLoading = computed(() => aumLoading.value || pnlLoading.value || varLoading.value || teLoading.value)

// --- Formatters (stat cards only) ---

function fmtPct(v: number): string {
  return `${v >= 0 ? '+' : ''}${v.toFixed(2)}%`
}

// --- Stat cards ---

const aumStat = computed(() => {
  const items = aumData.value ?? []
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
  const items = pnlData.value ?? []
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
  const items = varData.value ?? []
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
  const items = teData.value ?? []
  if (!items.length) return { value: '-', change: '', trend: 'flat' as const }
  const latest = items[items.length - 1]!
  return {
    value: `${latest.te.toFixed(2)}%`,
    change: `IR ${latest.infoRatio.toFixed(2)}`,
    trend: latest.infoRatio > 0 ? 'up' as const : latest.infoRatio < 0 ? 'down' as const : 'flat' as const,
  }
})

// --- Charts ---

const aumChartOption = computed(() => {
  const items = aumData.value ?? []
  return lineChart({
    categories: items.map((d) => d.date),
    series: [{ name: 'AuM', data: items.map((d) => d.aum), area: true }],
    format: 'currency',
  }, { color: ['#2C5969'] })
})

const pnlChartOption = computed(() => {
  const items = pnlData.value ?? []
  return lineChart({
    categories: items.map((d) => d.date),
    series: [{ name: 'Cumulative P&L', data: items.map((d) => d.cumulative) }],
    format: 'currency',
    zeroLine: true,
  }, { color: ['#A5B077'] })
})

const varChartOption = computed(() => {
  const items = varData.value ?? []
  return lineChart({
    categories: items.map((d) => d.date),
    series: [
      { name: 'VaR 95%', data: items.map((d) => d.var95) },
      { name: 'VaR 99%', data: items.map((d) => d.var99) },
    ],
  }, { color: ['#ee000c', '#61828E'], yAxis: { name: 'VaR (%)' } })
})

const exposureChartOption = computed(() => {
  const items = exposureData.value ?? []
  return pieChart({
    data: items.map((d) => ({ value: d.percentage, name: d.category })),
  })
})

const teChartOption = computed(() => {
  const items = teData.value ?? []
  return lineChart({
    categories: items.map((d) => d.date),
    series: [
      { name: 'Tracking Error', data: items.map((d) => d.te) },
      { name: 'Info Ratio', data: items.map((d) => d.infoRatio), yAxisIndex: 1 },
    ],
    format: 'percent',
    rightFormat: 'number',
  }, { color: ['#EAA159', '#61828E'], yAxis: [{ name: 'TE (%)' }, { name: 'Info Ratio' }] })
})

const liqChartOption = computed(() => {
  const items = liqData.value ?? []
  return barChart({
    categories: items.map((d) => d.horizon),
    series: [{ name: 'Liquidity', data: items.map((d) => d.percentage) }],
    format: 'percent',
    horizontal: true,
  }, { color: ['#2C5969'] })
})
</script>

<template>
  <div class="dashboard">
    <template v-if="analytics.hasPortfolio">
      <!-- KPI cards -->
      <div class="stat-row">
        <StatCard label="AuM" :value="aumStat.value" :change="aumStat.change" :trend="aumStat.trend" :loading="anyLoading" />
        <StatCard label="Daily P&L" :value="pnlStat.value" :change="pnlStat.change" :trend="pnlStat.trend" :loading="anyLoading" />
        <StatCard label="VaR 95%" :value="varStat.value" :change="varStat.change" :trend="varStat.trend" :loading="anyLoading" />
        <StatCard label="Tracking Error" :value="teStat.value" :change="teStat.change" :trend="teStat.trend" :loading="anyLoading" />
      </div>

      <!-- AuM + P&L -->
      <div class="chart-row">
        <ChartCard title="AuM" :option="aumChartOption" :loading="aumLoading" />
        <ChartCard title="Cumulative P&L" :option="pnlChartOption" :loading="pnlLoading" />
      </div>

      <!-- VaR + Allocation -->
      <div class="chart-row">
        <ChartCard title="Value at Risk" :option="varChartOption" :loading="varLoading" />
        <ChartCard title="Asset Allocation" :option="exposureChartOption" :loading="exposureLoading" />
      </div>

      <!-- TE + Liquidity -->
      <div class="chart-row">
        <ChartCard title="Tracking Error & Info Ratio" :option="teChartOption" :loading="teLoading" />
        <ChartCard title="Liquidity Profile" :option="liqChartOption" :loading="liqLoading" />
      </div>
    </template>
    <div v-else class="analytics-empty-state">
      <i class="pi pi-briefcase" />
      <p>Select a portfolio from the topbar to view summary analytics</p>
    </div>
  </div>
</template>

<style scoped>
.stat-row {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: var(--app-space-md);
  margin-bottom: var(--app-space-lg);
}

.chart-row {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: var(--app-space-lg);
  margin-bottom: var(--app-space-lg);
}

@media (max-width: 1024px) {
  .stat-row {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 768px) {
  .stat-row {
    grid-template-columns: 1fr;
  }

  .chart-row {
    grid-template-columns: 1fr;
  }
}
</style>
