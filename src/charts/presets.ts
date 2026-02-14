import type { EChartsOption } from 'echarts'
import type { BarChartConfig, ChartOverrides, LineChartConfig, PieChartConfig } from './types'
import { chartColors } from '@/theme/preset'
import { barChart } from './bar'
import { lineChart } from './line'
import { pieChart } from './pie'

/** Single-metric trend (AuM, NAV) - dark teal */
export function metricTrend(config: LineChartConfig, overrides?: ChartOverrides): EChartsOption {
  return lineChart(config, { color: [chartColors.tealDark], ...overrides })
}

/** P&L cumulative line - olive/positive with zero reference line */
export function pnlTrend(config: Omit<LineChartConfig, 'zeroLine'>, overrides?: ChartOverrides): EChartsOption {
  return lineChart({ ...config, zeroLine: true }, { color: [chartColors.positive], ...overrides })
}

/** VaR / ES risk lines - negative red + teal */
export function riskTrend(config: LineChartConfig, overrides?: ChartOverrides): EChartsOption {
  return lineChart(config, { color: [chartColors.negative, chartColors.teal], ...overrides })
}

/** Dual-metric overlay (TE + info ratio style) - amber + teal */
export function dualMetric(config: LineChartConfig, overrides?: ChartOverrides): EChartsOption {
  return lineChart(config, { color: [chartColors.amber, chartColors.teal], ...overrides })
}

/** Allocation donut - default series palette */
export function allocationDonut(config: PieChartConfig, overrides?: ChartOverrides): EChartsOption {
  return pieChart(config, overrides)
}

/** Liquidity horizon bars - dark teal, horizontal */
export function liquidityProfile(config: Omit<BarChartConfig, 'horizontal'>, overrides?: ChartOverrides): EChartsOption {
  return barChart({ ...config, horizontal: true }, { color: [chartColors.tealDark], ...overrides })
}
