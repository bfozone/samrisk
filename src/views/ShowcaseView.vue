<script setup lang="ts">
import ChartCard from '@/components/ChartCard.vue'
import DashboardGrid from '@/components/DashboardGrid.vue'
import { uiColorPresets } from '@/ui/config'
import {
  lineChart, barChart, pieChart, treemapChart, sunburstChart, heatmapChart,
  scatterChart, candlestickChart, boxplotChart, radarChart, gaugeChart, sankeyChart, treeChart,
  calendarHeatmapChart,
} from '@/charts'

// --- Line: Time Series (area, currency) ---
const lineTimeSeriesOption = lineChart({
  categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
  series: [{ name: 'AuM', data: [120_000, 134_000, 128_000, 145_000, 162_000, 158_000], area: true }],
  format: 'currency',
})

// --- Line: Dual Axis ---
const lineDualAxisOption = lineChart({
  categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
  series: [
    { name: 'Tracking Error', data: [1.2, 1.5, 1.3, 1.8, 1.6, 1.4] },
    { name: 'Info Ratio', data: [0.8, 0.6, 0.9, 0.5, 0.7, 0.85], yAxisIndex: 1 },
  ],
  format: 'percent',
  rightFormat: 'number',
})

// --- Bar: Vertical Stacked ---
const barStackedOption = barChart({
  categories: ['Q1', 'Q2', 'Q3', 'Q4'],
  series: [
    { name: 'Equities', data: [40, 35, 42, 38] },
    { name: 'Fixed Income', data: [30, 32, 28, 34] },
    { name: 'Alternatives', data: [15, 18, 20, 16] },
  ],
  stacked: true,
})

// --- Bar: Horizontal + Percent ---
const barHorizontalOption = barChart({
  categories: ['< 1 Day', '1-7 Days', '7-30 Days', '30-90 Days', '> 90 Days'],
  series: [{ name: 'Liquidity', data: [35, 25, 20, 12, 8] }],
  format: 'percent',
  horizontal: true,
})

// --- Bar: Horizontal Negative (active weights) ---
const barNegativeOption = barChart({
  categories: ['Equities', 'Govt Bonds', 'IG Credit', 'HY Credit', 'Real Estate', 'Cash'],
  series: [{ name: 'Active Weight', data: [2.4, -1.8, 1.1, -0.6, -1.5, 0.4] }],
  format: 'percent',
  horizontal: true,
  showLabels: true,
})

// --- Pie: Donut ---
const pieDonutOption = pieChart({
  data: [
    { name: 'Equities', value: 45 },
    { name: 'Fixed Income', value: 30 },
    { name: 'Real Estate', value: 12 },
    { name: 'Commodities', value: 8 },
    { name: 'Cash', value: 5 },
  ],
})

// --- Treemap: 2-level hierarchy ---
const treemapOption = treemapChart({
  data: [
    {
      name: 'Equities', value: 450_000, children: [
        { name: 'US Large Cap', value: 200_000 },
        { name: 'EU Developed', value: 120_000 },
        { name: 'EM Asia', value: 80_000 },
        { name: 'Japan', value: 50_000 },
      ],
    },
    {
      name: 'Fixed Income', value: 300_000, children: [
        { name: 'Govt Bonds', value: 150_000 },
        { name: 'IG Credit', value: 100_000 },
        { name: 'HY Credit', value: 50_000 },
      ],
    },
    {
      name: 'Alternatives', value: 150_000, children: [
        { name: 'Hedge Funds', value: 80_000 },
        { name: 'Private Equity', value: 70_000 },
      ],
    },
  ],
})

// --- Sunburst: Nested allocation ---
const sunburstOption = sunburstChart({
  data: [
    {
      name: 'Growth', children: [
        { name: 'US Tech', value: 25 },
        { name: 'EM Equity', value: 15 },
        { name: 'Small Cap', value: 10 },
      ],
    },
    {
      name: 'Income', children: [
        { name: 'Govt Bonds', value: 20 },
        { name: 'IG Credit', value: 12 },
        { name: 'HY Bonds', value: 8 },
      ],
    },
    {
      name: 'Diversifiers', children: [
        { name: 'Gold', value: 5 },
        { name: 'Real Estate', value: 5 },
      ],
    },
  ],
})

// --- Heatmap: Correlation matrix ---
const assets = ['Equities', 'Bonds', 'Commod.', 'Real Est.', 'Cash']
const heatmapOption = heatmapChart({
  xLabels: assets,
  yLabels: assets,
  data: [
    [0, 0, 1.0], [0, 1, -0.3], [0, 2, 0.4], [0, 3, 0.5], [0, 4, 0.0],
    [1, 0, -0.3], [1, 1, 1.0], [1, 2, -0.1], [1, 3, 0.2], [1, 4, 0.3],
    [2, 0, 0.4], [2, 1, -0.1], [2, 2, 1.0], [2, 3, 0.3], [2, 4, -0.1],
    [3, 0, 0.5], [3, 1, 0.2], [3, 2, 0.3], [3, 3, 1.0], [3, 4, 0.1],
    [4, 0, 0.0], [4, 1, 0.3], [4, 2, -0.1], [4, 3, 0.1], [4, 4, 1.0],
  ],
  min: -1,
  max: 1,
})

// --- Scatter: Risk vs Return ---
const scatterOption = scatterChart({
  series: [
    {
      name: 'Equities',
      data: [[12, 8.2], [15, 10.1], [18, 7.5], [10, 6.3], [14, 9.8]],
    },
    {
      name: 'Fixed Income',
      data: [[4, 3.1], [3, 2.8], [5, 4.2], [6, 3.5], [3.5, 2.5]],
    },
  ],
  xFormat: 'percent',
  yFormat: 'percent',
}, { xAxis: { name: 'Risk (%)' }, yAxis: { name: 'Return (%)' } })

// --- Candlestick: NAV Movement ---
const candlestickOption = candlestickChart({
  categories: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
  data: [
    [102.0, 104.5, 101.2, 105.1],
    [104.5, 103.8, 102.9, 105.3],
    [103.8, 106.2, 103.1, 106.8],
    [106.2, 105.1, 104.0, 107.0],
    [105.1, 107.3, 104.8, 108.2],
    [107.3, 106.5, 105.5, 108.0],
    [106.5, 108.9, 106.0, 109.5],
    [108.9, 108.1, 107.2, 110.0],
    [108.1, 110.4, 107.8, 111.2],
    [110.4, 109.8, 108.5, 111.5],
  ],
})

// --- Boxplot: Return Distribution ---
const boxplotOption = boxplotChart({
  categories: ['Equities', 'Bonds', 'Commodities', 'Real Estate'],
  data: [
    [-8.2, -1.5, 5.3, 12.1, 22.4],
    [-2.1, 0.8, 3.2, 5.1, 8.3],
    [-12.5, -3.8, 1.2, 7.6, 18.9],
    [-5.0, 0.2, 4.1, 8.5, 14.2],
  ],
  format: 'percent',
})

// --- Radar: Risk Profile ---
const radarOption = radarChart({
  indicators: [
    { name: 'Market Risk', max: 100 },
    { name: 'Credit Risk', max: 100 },
    { name: 'Liquidity', max: 100 },
    { name: 'Concentration', max: 100 },
    { name: 'Volatility', max: 100 },
    { name: 'Duration', max: 100 },
  ],
  series: [
    { name: 'Portfolio A', data: [72, 45, 88, 55, 63, 40] },
    { name: 'Benchmark', data: [50, 50, 70, 50, 50, 50] },
  ],
})

// --- Gauge: Limit Utilization ---
const gaugeOption = gaugeChart({
  value: 73,
  name: 'VaR Limit',
  thresholds: uiColorPresets.gaugeThresholds,
})

// --- Sankey: Exposure Flow ---
const sankeyOption = sankeyChart({
  nodes: [
    { name: 'Portfolio' },
    { name: 'Equities' },
    { name: 'Fixed Income' },
    { name: 'Alternatives' },
    { name: 'US' },
    { name: 'Europe' },
    { name: 'Asia' },
    { name: 'Govt' },
    { name: 'Credit' },
  ],
  links: [
    { source: 'Portfolio', target: 'Equities', value: 450 },
    { source: 'Portfolio', target: 'Fixed Income', value: 350 },
    { source: 'Portfolio', target: 'Alternatives', value: 200 },
    { source: 'Equities', target: 'US', value: 250 },
    { source: 'Equities', target: 'Europe', value: 120 },
    { source: 'Equities', target: 'Asia', value: 80 },
    { source: 'Fixed Income', target: 'Govt', value: 200 },
    { source: 'Fixed Income', target: 'Credit', value: 150 },
  ],
  format: 'currency',
})

// --- Tree: Fund Structure (left-to-right) ---
const treeOption = treeChart({
  data: {
    name: 'Firm',
    children: [
      {
        name: 'Growth Fund',
        children: [
          { name: 'US Equities' },
          { name: 'EM Equities' },
          { name: 'Tech Sector' },
        ],
      },
      {
        name: 'Income Fund',
        children: [
          { name: 'Govt Bonds' },
          { name: 'IG Credit' },
        ],
      },
      {
        name: 'Multi-Asset',
        children: [
          { name: 'Balanced' },
          { name: 'Defensive' },
          { name: 'Aggressive' },
        ],
      },
    ],
  },
})

// --- Radar: Multi-Fund Comparison (spider) ---
const radarComparisonOption = radarChart({
  indicators: [
    { name: 'Return', max: 20 },
    { name: 'Sharpe', max: 3 },
    { name: 'Max DD', max: 25 },
    { name: 'Volatility', max: 20 },
    { name: 'Turnover', max: 100 },
    { name: 'ESG Score', max: 100 },
  ],
  series: [
    { name: 'Growth Fund', data: [14.2, 1.8, 18, 12.5, 65, 72] },
    { name: 'Income Fund', data: [5.1, 1.2, 6, 4.2, 28, 85] },
    { name: 'Multi-Asset', data: [8.6, 1.5, 11, 7.8, 42, 78] },
  ],
})

// --- Calendar Heatmap: Daily P&L ---
function generateDailyPnl(year: string): [string, number][] {
  const data: [string, number][] = []
  const start = new Date(`${year}-01-01`)
  const end = new Date(`${year}-12-31`)
  let seed = 42
  for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
    const day = d.getDay()
    if (day === 0 || day === 6) continue
    seed = (seed * 16807 + 0) % 2147483647
    const r = seed / 2147483647
    const pnl = (r - 0.48) * 4
    data.push([d.toISOString().slice(0, 10), +pnl.toFixed(2)])
  }
  return data
}

const calendarHeatmapOption = calendarHeatmapChart({
  data: generateDailyPnl('2025'),
  year: '2025',
  min: -2,
  max: 2,
  colorRange: uiColorPresets.calendarHeatmapRange,
  format: (v: number) => `${v >= 0 ? '+' : ''}${v.toFixed(2)}%`,
})
</script>

<template>
  <div class="showcase">
    <DashboardGrid>
      <ChartCard title="Line - Time Series" :option="lineTimeSeriesOption" />
      <ChartCard title="Line - Dual Axis" :option="lineDualAxisOption" />
      <ChartCard title="Bar - Vertical Stacked" :option="barStackedOption" />
      <ChartCard title="Bar - Horizontal" :option="barHorizontalOption" />
      <ChartCard title="Bar - Active Weights" :option="barNegativeOption" />
      <ChartCard title="Pie - Donut" :option="pieDonutOption" />
      <ChartCard title="Treemap" :option="treemapOption" />
      <ChartCard title="Sunburst" :option="sunburstOption" />
      <ChartCard title="Heatmap" :option="heatmapOption" />
      <ChartCard title="Scatter - Risk vs Return" :option="scatterOption" />
      <ChartCard title="Candlestick - NAV" :option="candlestickOption" />
      <ChartCard title="Boxplot - Return Distribution" :option="boxplotOption" />
      <ChartCard title="Radar - Risk Profile" :option="radarOption" />
      <ChartCard title="Gauge - Limit Utilization" :option="gaugeOption" />
      <ChartCard title="Sankey - Exposure Flow" :option="sankeyOption" />
      <ChartCard title="Tree - Fund Structure" :option="treeOption" />
      <ChartCard title="Radar - Multi-Fund Comparison" :option="radarComparisonOption" />
      <ChartCard title="Calendar Heatmap - Daily P&L" :option="calendarHeatmapOption" size="sm" />
    </DashboardGrid>
  </div>
</template>

<style scoped>
.showcase {
  max-width: 1400px;
}
</style>
