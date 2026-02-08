<script setup lang="ts">
import { computed } from 'vue'
import { useAnalyticsContext } from '@/stores/analytics'
import ChartCard from '@/components/ChartCard.vue'
import StatCard from '@/components/StatCard.vue'
import { useVaR, useExposures, useAuM, useTrackingError, usePnL, useLiquidity } from '@/composables/useRisk'
import { chartColors } from '@/theme/preset'
import type { EChartsOption } from 'echarts'

const analytics = useAnalyticsContext()
const portfolioId = computed(() => analytics.portfolioId ?? '')

const { data: varData, isLoading: varLoading } = useVaR(portfolioId)
const { data: exposureData, isLoading: exposureLoading } = useExposures(portfolioId)
const { data: aumData, isLoading: aumLoading } = useAuM(portfolioId)
const { data: teData, isLoading: teLoading } = useTrackingError(portfolioId)
const { data: pnlData, isLoading: pnlLoading } = usePnL(portfolioId)
const { data: liqData, isLoading: liqLoading } = useLiquidity(portfolioId)

const anyLoading = computed(() => aumLoading.value || pnlLoading.value || varLoading.value || teLoading.value)

// --- Formatters ---

function fmtEur(v: number): string {
  const abs = Math.abs(v)
  if (abs >= 1_000_000_000) return `${(v / 1_000_000_000).toFixed(1)}B`
  if (abs >= 1_000_000) return `${(v / 1_000_000).toFixed(1)}M`
  if (abs >= 1_000) return `${(v / 1_000).toFixed(0)}K`
  return v.toFixed(0)
}

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
    value: `EUR ${fmtEur(latest.aum)}`,
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
    value: `EUR ${v >= 0 ? '+' : ''}${fmtEur(v)}`,
    change: `MTD ${fmtEur(latest.mtd)}`,
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

const aumChartOption = computed<EChartsOption>(() => {
  const items = aumData.value ?? []
  return {
    color: [chartColors.tealDark],
    tooltip: { trigger: 'axis', valueFormatter: (v) => `EUR ${fmtEur(v as number)}` },
    xAxis: { type: 'category', data: items.map((d) => d.date), boundaryGap: false },
    yAxis: { type: 'value', axisLabel: { formatter: (v: number) => fmtEur(v) } },
    series: [{
      name: 'AuM',
      type: 'line',
      data: items.map((d) => d.aum),
      smooth: true,
      showSymbol: false,
      areaStyle: { opacity: 0.15 },
    }],
    grid: { left: 60, right: 16, top: 16, bottom: 28 },
  }
})

const pnlChartOption = computed<EChartsOption>(() => {
  const items = pnlData.value ?? []
  return {
    color: [chartColors.olive],
    tooltip: { trigger: 'axis', valueFormatter: (v) => `EUR ${fmtEur(v as number)}` },
    xAxis: { type: 'category', data: items.map((d) => d.date), boundaryGap: false },
    yAxis: { type: 'value', axisLabel: { formatter: (v: number) => fmtEur(v) } },
    series: [{
      name: 'Cumulative P&L',
      type: 'line',
      data: items.map((d) => d.cumulative),
      smooth: true,
      showSymbol: false,
      markLine: {
        silent: true,
        symbol: 'none',
        lineStyle: { color: chartColors.grey, type: 'dashed' },
        data: [{ yAxis: 0 }],
      },
    }],
    grid: { left: 60, right: 16, top: 16, bottom: 28 },
  }
})

const varChartOption = computed<EChartsOption>(() => {
  const items = varData.value ?? []
  return {
    color: [chartColors.red, chartColors.info],
    tooltip: { trigger: 'axis' },
    xAxis: { type: 'category', data: items.map((d) => d.date), boundaryGap: false },
    yAxis: { type: 'value', name: 'VaR (%)' },
    series: [
      { name: 'VaR 95%', type: 'line', data: items.map((d) => d.var95), smooth: true, showSymbol: false },
      { name: 'VaR 99%', type: 'line', data: items.map((d) => d.var99), smooth: true, showSymbol: false },
    ],
    grid: { left: 48, right: 16, top: 32, bottom: 28 },
  }
})

const exposureChartOption = computed<EChartsOption>(() => {
  const items = exposureData.value ?? []
  return {
    color: chartColors.series,
    tooltip: { trigger: 'item' },
    series: [{
      type: 'pie',
      radius: ['40%', '70%'],
      data: items.map((d) => ({ value: d.percentage, name: d.category })),
      label: { show: true, formatter: '{b}: {d}%' },
    }],
  }
})

const teChartOption = computed<EChartsOption>(() => {
  const items = teData.value ?? []
  return {
    color: [chartColors.amber, chartColors.teal],
    tooltip: { trigger: 'axis' },
    xAxis: { type: 'category', data: items.map((d) => d.date), boundaryGap: false },
    yAxis: [
      { type: 'value', name: 'TE (%)', position: 'left' },
      { type: 'value', name: 'Info Ratio', position: 'right' },
    ],
    series: [
      { name: 'Tracking Error', type: 'line', data: items.map((d) => d.te), smooth: true, showSymbol: false, yAxisIndex: 0 },
      { name: 'Info Ratio', type: 'line', data: items.map((d) => d.infoRatio), smooth: true, showSymbol: false, yAxisIndex: 1 },
    ],
    grid: { left: 48, right: 48, top: 32, bottom: 28 },
  }
})

const liqChartOption = computed<EChartsOption>(() => {
  const items = liqData.value ?? []
  return {
    color: [chartColors.tealDark],
    tooltip: { trigger: 'axis', valueFormatter: (v) => `${v}%` },
    xAxis: { type: 'value', max: 100, axisLabel: { formatter: '{value}%' } },
    yAxis: { type: 'category', data: items.map((d) => d.horizon) },
    series: [{
      name: 'Liquidity',
      type: 'bar',
      data: items.map((d) => d.percentage),
      barMaxWidth: 28,
      label: { show: true, position: 'right', formatter: '{c}%' },
    }],
    grid: { left: 80, right: 48, top: 8, bottom: 28, containLabel: false },
  }
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
