import type { EChartsOption } from 'echarts'
import { chartColors } from '@/theme/preset'

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
  left: 80,
  right: 48,
  top: 8,
  bottom: 28,
  containLabel: false,
}

// --- Tooltips: dark, rounded, no border ---

const tooltipBase = {
  backgroundColor: 'rgba(28, 32, 38, 0.92)',
  borderColor: 'transparent',
  borderWidth: 0,
  textStyle: {
    fontFamily,
    color: '#f0f0f0',
    fontSize: 12,
  },
  padding: [8, 12] as [number, number],
  extraCssText: 'border-radius: 8px; box-shadow: 0 4px 16px rgba(0,0,0,0.16);',
}

export const tooltipAxis: EChartsOption['tooltip'] = {
  trigger: 'axis',
  ...tooltipBase,
  axisPointer: {
    type: 'line',
    lineStyle: { color: '#d5d7d9', type: 'dashed' },
  },
}

export const tooltipItem: EChartsOption['tooltip'] = {
  trigger: 'item',
  ...tooltipBase,
}

export const tooltipCross: EChartsOption['tooltip'] = {
  trigger: 'axis',
  ...tooltipBase,
  axisPointer: {
    type: 'cross',
    crossStyle: { color: '#d5d7d9' },
    lineStyle: { color: '#d5d7d9', type: 'dashed' },
  },
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
