import type { AuMSnapshot, PnLResult, VaRResult, TrackingErrorResult, ExposureBucket, LiquidityBucket } from '@/api/schemas'
import { formatValue, type LineChartConfig, type PieChartConfig, type BarChartConfig } from '@/charts'
import type { ChartOverrides } from '@/charts'

export interface StatCardData {
  label: string
  value: string
  change: string
  trend: 'up' | 'down' | 'flat'
}

function fmtPct(v: number): string {
  return `${v >= 0 ? '+' : ''}${v.toFixed(2)}%`
}

// --- Stat derivation ---

export function deriveAuMStat(items: AuMSnapshot[], currency: string): StatCardData {
  if (items.length < 2) return { label: 'AuM', value: '-', change: '', trend: 'flat' }
  const latest = items[items.length - 1]!
  const prev = items[items.length - 2]!
  const pctChange = ((latest.aum - prev.aum) / prev.aum) * 100
  return {
    label: 'AuM',
    value: formatValue(latest.aum, 'currency', currency),
    change: fmtPct(pctChange),
    trend: pctChange > 0.01 ? 'up' : pctChange < -0.01 ? 'down' : 'flat',
  }
}

export function derivePnLStat(items: PnLResult[], currency: string): StatCardData {
  if (!items.length) return { label: 'Daily P&L', value: '-', change: '', trend: 'flat' }
  const latest = items[items.length - 1]!
  const v = latest.daily
  return {
    label: 'Daily P&L',
    value: `${v >= 0 ? '+' : ''}${formatValue(v, 'currency', currency)}`,
    change: `MTD ${formatValue(latest.mtd, 'currency', currency)}`,
    trend: v > 0 ? 'up' : v < 0 ? 'down' : 'flat',
  }
}

export function deriveVaRStat(items: VaRResult[]): StatCardData {
  if (items.length < 2) return { label: 'VaR 95%', value: '-', change: '', trend: 'flat' }
  const latest = items[items.length - 1]!
  const prev = items[items.length - 2]!
  const diff = latest.var95 - prev.var95
  return {
    label: 'VaR 95%',
    value: `${latest.var95.toFixed(2)}%`,
    change: fmtPct(diff),
    trend: diff > 0.01 ? 'up' : diff < -0.01 ? 'down' : 'flat',
  }
}

export function deriveTEStat(items: TrackingErrorResult[]): StatCardData {
  if (!items.length) return { label: 'Tracking Error', value: '-', change: '', trend: 'flat' }
  const latest = items[items.length - 1]!
  return {
    label: 'Tracking Error',
    value: `${latest.te.toFixed(2)}%`,
    change: `IR ${latest.infoRatio.toFixed(2)}`,
    trend: latest.infoRatio > 0 ? 'up' : latest.infoRatio < 0 ? 'down' : 'flat',
  }
}

// --- Chart config builders ---

export function buildAuMChart(items: AuMSnapshot[]): LineChartConfig {
  return {
    categories: items.map((d) => d.date),
    series: [{ name: 'AuM', data: items.map((d) => d.aum), area: true }],
    format: 'currency',
  }
}

export function buildPnLChart(items: PnLResult[]): Omit<LineChartConfig, 'zeroLine'> {
  return {
    categories: items.map((d) => d.date),
    series: [{ name: 'Cumulative P&L', data: items.map((d) => d.cumulative) }],
    format: 'currency',
  }
}

export function buildVaRChart(items: VaRResult[]): LineChartConfig {
  return {
    categories: items.map((d) => d.date),
    series: [
      { name: 'VaR 95%', data: items.map((d) => d.var95) },
      { name: 'VaR 99%', data: items.map((d) => d.var99) },
    ],
  }
}

export function buildExposureChart(items: ExposureBucket[]): PieChartConfig {
  return {
    data: items.map((d) => ({ value: d.percentage, name: d.category })),
  }
}

export function buildTEChart(items: TrackingErrorResult[]): LineChartConfig {
  return {
    categories: items.map((d) => d.date),
    series: [
      { name: 'Tracking Error', data: items.map((d) => d.te) },
      { name: 'Info Ratio', data: items.map((d) => d.infoRatio), yAxisIndex: 1 },
    ],
    format: 'percent',
    rightFormat: 'number',
  }
}

export function buildLiquidityChart(items: LiquidityBucket[]): Omit<BarChartConfig, 'horizontal'> {
  return {
    categories: items.map((d) => d.horizon),
    series: [{ name: 'Liquidity', data: items.map((d) => d.percentage) }],
    format: 'percent',
  }
}

// --- Chart card definitions ---

export interface ChartCardDef {
  title: string
  preset: string
  overrides?: ChartOverrides
}

export const chartCardDefs: ChartCardDef[] = [
  { title: 'AuM', preset: 'metricTrend' },
  { title: 'Cumulative P&L', preset: 'pnlTrend' },
  { title: 'Value at Risk', preset: 'riskTrend', overrides: { yAxis: { name: 'VaR (%)' } } },
  { title: 'Asset Allocation', preset: 'allocationDonut' },
  { title: 'Tracking Error & Info Ratio', preset: 'dualMetric', overrides: { yAxis: [{ name: 'TE (%)' }, { name: 'Info Ratio' }] } },
  { title: 'Liquidity Profile', preset: 'liquidityProfile' },
]
