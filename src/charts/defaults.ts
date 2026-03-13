import type { EChartsOption } from 'echarts'
import { chartColors } from '@/theme/colors'

// --- Shared text style ---

const fontFamily = 'Inter, Helvetica, Arial, sans-serif'
const labelColor = chartColors.grey
const labelSize = 11

export const textStyle: EChartsOption['textStyle'] = {
  fontFamily,
  color: labelColor,
}

// --- Clean axis: no lines, no ticks, muted labels ---

export const cleanAxisLine = { show: false }
export const cleanAxisTick = { show: false }
export const cleanAxisLabel = {
  fontSize: labelSize,
  color: labelColor,
}

export const cleanSplitLine = {
  show: true,
  lineStyle: { type: 'dashed' as const, color: '#e5e7eb', width: 1 },
}

export const noSplitLine = { show: false }

// --- Grids ---

export const gridDefault: EChartsOption['grid'] = {
  left: 48,
  right: 16,
  top: 16,
  bottom: 28,
}

export const gridCurrency: EChartsOption['grid'] = {
  left: 60,
  right: 16,
  top: 16,
  bottom: 28,
}

export const gridDualAxis: EChartsOption['grid'] = {
  left: 48,
  right: 48,
  top: 16,
  bottom: 28,
}

export const gridHorizontalBar: EChartsOption['grid'] = {
  left: 8,
  right: 48,
  top: 8,
  bottom: 28,
  containLabel: true,
}

// --- Tooltips: dark, rounded, no border ---

function getChartToken(name: string, fallback: string): string {
  if (typeof document === 'undefined')
    return fallback
  return getComputedStyle(document.documentElement).getPropertyValue(name).trim() || fallback
}

function createTooltipBase() {
  const bg = getChartToken('--color-chart-tooltip-bg', 'rgba(28, 32, 38, 0.92)')
  const text = getChartToken('--color-chart-tooltip-text', '#f0f0f0')
  const pointer = getChartToken('--color-chart-axis-pointer', '#d5d7d9')
  return { bg, text, pointer }
}

export function tooltipAxis(): EChartsOption['tooltip'] {
  const { bg, text, pointer } = createTooltipBase()
  return {
    trigger: 'axis',
    backgroundColor: bg,
    borderColor: 'transparent',
    borderWidth: 0,
    textStyle: { fontFamily, color: text, fontSize: 12 },
    padding: [8, 12] as [number, number],
    extraCssText: 'border-radius: 8px; box-shadow: 0 4px 16px rgba(0,0,0,0.16);',
    axisPointer: {
      type: 'line',
      lineStyle: { color: pointer, type: 'dashed' },
    },
  }
}

export function tooltipItem(): EChartsOption['tooltip'] {
  const { bg, text } = createTooltipBase()
  return {
    trigger: 'item',
    backgroundColor: bg,
    borderColor: 'transparent',
    borderWidth: 0,
    textStyle: { fontFamily, color: text, fontSize: 12 },
    padding: [8, 12] as [number, number],
    extraCssText: 'border-radius: 8px; box-shadow: 0 4px 16px rgba(0,0,0,0.16);',
  }
}

export function tooltipCross(): EChartsOption['tooltip'] {
  const { bg, text, pointer } = createTooltipBase()
  return {
    trigger: 'axis',
    backgroundColor: bg,
    borderColor: 'transparent',
    borderWidth: 0,
    textStyle: { fontFamily, color: text, fontSize: 12 },
    padding: [8, 12] as [number, number],
    extraCssText: 'border-radius: 8px; box-shadow: 0 4px 16px rgba(0,0,0,0.16);',
    axisPointer: {
      type: 'cross',
      crossStyle: { color: pointer },
      lineStyle: { color: pointer, type: 'dashed' },
    },
  }
}

export function chartSeparatorColor(): string {
  return getChartToken('--color-chart-separator', '#ffffff')
}

// --- Legend: bottom, rounded indicators ---

export const legendBottom = {
  bottom: 0,
  icon: 'roundRect',
  itemWidth: 12,
  itemHeight: 8,
  itemGap: 16,
  textStyle: {
    fontFamily,
    fontSize: labelSize,
    color: labelColor,
  },
}

// --- Animation ---

export const animation = {
  animationDuration: 600,
  animationEasing: 'cubicOut' as const,
}

// --- Emphasis: dim non-hovered series ---

export const emphasisFocus = {
  emphasis: { focus: 'series' as const, blurScope: 'global' as const },
}
