import type { EChartsOption } from 'echarts'
import type { RadarChartConfig, ChartOverrides } from './types'
import { chartColors } from '@/theme/preset'
import { tooltipItem, textStyle, legendBottom, animation } from './defaults'
import { deepMerge } from './merge'

export function radarChart(config: RadarChartConfig, overrides?: ChartOverrides): EChartsOption {
  const {
    indicators,
    series,
    showLegend = series.length > 1,
  } = config

  const colors = series.map((_, i) => chartColors.series[i % chartColors.series.length]!)

  const echartsSeries: EChartsOption['series'] = [
    {
      type: 'radar',
      data: series.map((s) => ({
        name: s.name,
        value: s.data,
        areaStyle: { opacity: 0.15 },
      })),
      emphasis: { focus: 'series', blurScope: 'global' },
    },
  ]

  const option: EChartsOption = {
    color: colors,
    textStyle,
    tooltip: tooltipItem,
    radar: {
      indicator: indicators,
      shape: 'polygon',
      axisLine: { lineStyle: { color: '#e5e7eb' } },
      splitLine: { lineStyle: { color: '#e5e7eb', type: 'dashed' } },
      splitArea: { show: false },
      axisName: { color: chartColors.grey, fontSize: 11 },
    },
    series: echartsSeries,
    ...animation,
  }

  if (showLegend) {
    option.legend = legendBottom
  }

  return overrides ? deepMerge(option, overrides) : option
}
