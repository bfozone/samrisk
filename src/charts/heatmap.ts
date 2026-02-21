import type { EChartsOption } from 'echarts'
import type { ChartOverrides, HeatmapChartConfig } from './types'
import { chartColors } from '@/theme/colors'
import {
  animation,
  chartSeparatorColor,
  cleanAxisLabel,
  cleanAxisLine,
  cleanAxisTick,
  textStyle,
  tooltipItem,
} from './defaults'
import { formatValue } from './format'
import { deepMerge } from './merge'

export function heatmapChart(config: HeatmapChartConfig, overrides?: ChartOverrides): EChartsOption {
  const values = config.data.map(d => d[2])
  const {
    xLabels,
    yLabels,
    data,
    format = 'number',
    currency,
    min = values.length ? Math.min(...values) : 0,
    max = values.length ? Math.max(...values) : 1,
    colorRange = [chartColors.tealBg, chartColors.red],
  } = config

  const option: EChartsOption = {
    textStyle,
    tooltip: {
      ...tooltipItem(),
      formatter(params: unknown) {
        const p = params as { value: [number, number, number] }
        const [xi, yi, val] = p.value
        return `${xLabels[xi]} / ${yLabels[yi]}: ${formatValue(val, format, currency)}`
      },
    },
    xAxis: {
      type: 'category',
      data: xLabels,
      splitArea: { show: true },
      axisLine: cleanAxisLine,
      axisTick: cleanAxisTick,
      axisLabel: cleanAxisLabel,
    },
    yAxis: {
      type: 'category',
      data: yLabels,
      splitArea: { show: true },
      axisLine: cleanAxisLine,
      axisTick: cleanAxisTick,
      axisLabel: cleanAxisLabel,
    },
    visualMap: {
      min,
      max,
      calculable: true,
      orient: 'horizontal',
      left: 'center',
      bottom: 0,
      inRange: { color: colorRange },
      textStyle: { fontSize: 11, color: chartColors.grey },
    },
    series: [
      {
        type: 'heatmap',
        data,
        label: { show: true, fontSize: 11, formatter: (p: unknown) => formatValue((p as { value: [number, number, number] }).value[2], format, currency) },
        emphasis: { itemStyle: { shadowBlur: 12, shadowColor: 'rgba(0, 0, 0, 0.15)' } },
        itemStyle: { borderColor: chartSeparatorColor(), borderWidth: 2, borderRadius: 2 },
      },
    ],
    grid: { left: 80, right: 16, top: 16, bottom: 60 },
    ...animation,
  }

  return overrides ? deepMerge(option, overrides) : option
}
