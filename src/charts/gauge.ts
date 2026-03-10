import type { EChartsOption } from 'echarts'
import type { ChartOverrides, GaugeChartConfig } from './types'
import { chartColors } from '@/theme/colors'
import { animation, textStyle } from './defaults'
import { deepMerge } from './merge'

export function gaugeChart(config: GaugeChartConfig, overrides?: ChartOverrides): EChartsOption {
  const {
    value,
    name = '',
    min = 0,
    max = 100,
    thresholds,
  } = config

  const axisLine: Record<string, unknown> = {
    lineStyle: { width: 16 },
    roundCap: true,
  }
  if (thresholds) {
    axisLine.lineStyle = {
      width: 16,
      color: thresholds.map(t => [t[0], t[1]]),
    }
  }

  const option: EChartsOption = {
    textStyle,
    series: [
      {
        type: 'gauge',
        min,
        max,
        progress: { show: !thresholds, width: 16, roundCap: true, itemStyle: { color: chartColors.teal } },
        axisLine,
        axisTick: { show: false },
        splitLine: { length: 8, lineStyle: { width: 1.5, color: '#d5d7d9' } },
        axisLabel: { distance: 20, fontSize: 11, color: chartColors.grey },
        pointer: { width: 4, itemStyle: { color: chartColors.charcoal } },
        detail: {
          valueAnimation: true,
          formatter: '{value}',
          fontSize: 24,
          fontWeight: 600,
          color: chartColors.charcoal,
          offsetCenter: [0, '70%'],
        },
        title: { fontSize: 12, color: chartColors.grey, offsetCenter: [0, '85%'] },
        data: [{ value, name }],
      },
    ],
    ...animation,
  }

  return overrides ? deepMerge(option, overrides) : option
}
