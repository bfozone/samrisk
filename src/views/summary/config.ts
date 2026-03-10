import type { AuMSnapshot, ExposureBucket, LiquidityBucket, PerformanceSeries, PnLResult, TrackingErrorResult, VaRResult } from '@/api/schemas'
import type { BarChartConfig, LineChartConfig, PieChartConfig } from '@/charts'
import { formatValue } from '@/charts'

export type RiskStatus = 'ok' | 'warning' | 'critical'

export interface StatCardData {
  label: string
  value: string
  change: string
  trend: 'up' | 'down' | 'flat'
  sparkline?: number[]
  status?: RiskStatus
}

function fmtPct(v: number): string {
  return `${v >= 0 ? '+' : ''}${v.toFixed(2)}%`
}

// --- Stat derivation ---

export function deriveAuMStat(items: AuMSnapshot[], currency: string): StatCardData {
  if (items.length < 2)
    return { label: 'AuM', value: '-', change: '', trend: 'flat' }
  const latest = items.at(-1)!
  const prev = items.at(-2)!
  const pctChange = ((latest.aum - prev.aum) / prev.aum) * 100
  return {
    label: 'AuM',
    value: formatValue(latest.aum, 'currency', currency),
    change: fmtPct(pctChange),
    trend: pctChange > 0.01 ? 'up' : pctChange < -0.01 ? 'down' : 'flat',
    sparkline: items.map(d => d.aum),
  }
}

export function derivePnLStat(items: PnLResult[], currency: string): StatCardData {
  if (!items.length)
    return { label: 'Daily P&L', value: '-', change: '', trend: 'flat' }
  const latest = items.at(-1)!
  const v = latest.daily
  return {
    label: 'Daily P&L',
    value: `${v >= 0 ? '+' : ''}${formatValue(v, 'currency', currency)}`,
    change: `MTD ${formatValue(latest.mtd, 'currency', currency)}`,
    trend: v > 0 ? 'up' : v < 0 ? 'down' : 'flat',
    sparkline: items.map(d => d.cumulative),
  }
}

export function varStatus(var95: number): RiskStatus {
  if (var95 > 5)
    return 'critical'
  if (var95 > 3)
    return 'warning'
  return 'ok'
}

export function deriveVaRStat(items: VaRResult[]): StatCardData {
  if (items.length < 2)
    return { label: 'VaR 95%', value: '-', change: '', trend: 'flat' }
  const latest = items.at(-1)!
  const prev = items.at(-2)!
  const diff = latest.var95 - prev.var95
  return {
    label: 'VaR 95%',
    value: `${latest.var95.toFixed(2)}%`,
    change: fmtPct(diff),
    trend: diff > 0.01 ? 'up' : diff < -0.01 ? 'down' : 'flat',
    sparkline: items.map(d => d.var95),
    status: varStatus(latest.var95),
  }
}

export function deriveTEStat(items: TrackingErrorResult[]): StatCardData {
  if (!items.length)
    return { label: 'Tracking Error', value: '-', change: '', trend: 'flat' }
  const latest = items.at(-1)!
  return {
    label: 'Tracking Error',
    value: `${latest.te.toFixed(2)}%`,
    change: `IR ${latest.infoRatio.toFixed(2)}`,
    trend: latest.infoRatio > 0 ? 'up' : latest.infoRatio < 0 ? 'down' : 'flat',
    sparkline: items.map(d => d.te),
  }
}

export function derivePerformanceStat(performance: PerformanceSeries[], pnl: PnLResult[], currency: string): StatCardData {
  if (!pnl.length)
    return { label: 'YTD Return', value: '-', change: '', trend: 'flat' }
  const latest = pnl.at(-1)!
  const latestPerf = performance.at(-1)
  const activeReturn = latestPerf?.activeReturn ?? 0
  return {
    label: 'YTD Return',
    value: `${latest.ytd >= 0 ? '+' : ''}${formatValue(latest.ytd, 'currency', currency)}`,
    change: `vs Bmk ${fmtPct(activeReturn * 100)}`,
    trend: activeReturn > 0.0001 ? 'up' : activeReturn < -0.0001 ? 'down' : 'flat',
    sparkline: performance.map(d => d.portfolioReturn),
  }
}

export function deriveLiquidityStat(items: LiquidityBucket[]): StatCardData {
  if (!items.length)
    return { label: '7-Day Liquidity', value: '-', change: '', trend: 'flat' }
  const shortHorizons = ['1 Day', '2-7 Days']
  const pct = items
    .filter(b => shortHorizons.includes(b.horizon))
    .reduce((sum, b) => sum + b.percentage, 0)
  const status: RiskStatus = pct >= 50 ? 'ok' : pct >= 30 ? 'warning' : 'critical'
  return {
    label: '7-Day Liquidity',
    value: `${Math.round(pct)}%`,
    change: '',
    trend: 'flat',
    status,
  }
}

export function deriveCreditStat(): StatCardData {
  return {
    label: 'Avg Rating',
    value: 'A+',
    change: 'Investment Grade',
    trend: 'flat',
  }
}

export function deriveEsgStat(): StatCardData {
  return {
    label: 'ESG Score',
    value: '72',
    change: '/100',
    trend: 'flat',
  }
}

// --- Chart config builders ---

export function buildAuMChart(items: AuMSnapshot[], currency: string, performance: PerformanceSeries[] = []): LineChartConfig {
  const benchmarkByDate = new Map(performance.map(p => [p.date, p.benchmarkReturn]))
  const startingAuM = items.length ? items[0]!.aum : 0
  const benchmarkNav = items.map((d) => {
    const bmkReturn = benchmarkByDate.get(d.date) ?? 0
    return Math.round(startingAuM * (1 + bmkReturn))
  })
  const hasBenchmark = performance.length > 0

  return {
    categories: items.map(d => d.date),
    series: [
      { name: 'Portfolio', data: items.map(d => d.aum), area: true },
      ...(hasBenchmark ? [{ name: 'Benchmark', data: benchmarkNav }] : []),
    ],
    format: 'currency',
    currency,
  }
}

export function buildPnLChart(items: PnLResult[], currency: string, performance: PerformanceSeries[] = [], startingNav = 0): Omit<LineChartConfig, 'zeroLine'> {
  const benchmarkByDate = new Map(performance.map(p => [p.date, p.benchmarkReturn]))
  const benchmarkPnL = items.map((d) => {
    const bmkReturn = benchmarkByDate.get(d.date) ?? 0
    return Math.round(startingNav * bmkReturn)
  })
  const hasBenchmark = performance.length > 0 && startingNav > 0

  return {
    categories: items.map(d => d.date),
    series: [
      { name: 'Portfolio', data: items.map(d => d.cumulative) },
      ...(hasBenchmark ? [{ name: 'Benchmark', data: benchmarkPnL }] : []),
    ],
    format: 'currency',
    currency,
  }
}

export function buildVaRChart(items: VaRResult[]): LineChartConfig {
  return {
    categories: items.map(d => d.date),
    series: [
      { name: 'VaR 95%', data: items.map(d => d.var95) },
      { name: 'VaR 99%', data: items.map(d => d.var99) },
    ],
  }
}

export function buildExposureChart(items: ExposureBucket[]): PieChartConfig {
  return {
    data: items.map(d => ({ value: d.percentage, name: d.category })),
  }
}

export function buildTEChart(items: TrackingErrorResult[]): LineChartConfig {
  return {
    categories: items.map(d => d.date),
    series: [
      { name: 'Tracking Error', data: items.map(d => d.te) },
      { name: 'Info Ratio', data: items.map(d => d.infoRatio), yAxisIndex: 1 },
    ],
    format: 'percent',
    rightFormat: 'number',
  }
}

export function buildLiquidityChart(items: LiquidityBucket[]): Omit<BarChartConfig, 'horizontal'> {
  return {
    categories: items.map(d => d.horizon),
    series: [{ name: 'Liquidity', data: items.map(d => d.percentage) }],
    format: 'percent',
  }
}

export function buildPerformanceChart(items: PerformanceSeries[]): LineChartConfig {
  return {
    categories: items.map(d => d.date),
    series: [
      { name: 'Portfolio', data: items.map(d => d.portfolioReturn) },
      { name: 'Benchmark', data: items.map(d => d.benchmarkReturn) },
      { name: 'Active Return', data: items.map(d => d.activeReturn), yAxisIndex: 1 },
    ],
    format: 'percent',
    rightFormat: 'percent',
  }
}
