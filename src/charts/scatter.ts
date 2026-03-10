import type { EChartsOption } from 'echarts'
import type { ChartOverrides, ScatterChartConfig } from './types'
import { chartColors } from '@/theme/colors'
import {
  animation,
  cleanAxisLabel,
  cleanAxisLine,
  cleanAxisTick,
  cleanSplitLine,
  emphasisFocus,
  gridCurrency,
  gridDefault,
  legendBottom,
  textStyle,
  tooltipItem,
} from './defaults'
import { axisFormatter, formatValue } from './format'
import { deepMerge } from './merge'

export function scatterChart(config: ScatterChartConfig, overrides?: ChartOverrides): EChartsOption {
  const {
    series,
    xFormat = 'number',
    yFormat = 'number',
    currency,
    showLegend = series.length > 1,
  } = config

  const colors = series.map((_, i) => chartColors.series[i % chartColors.series.length]!)

  const echartsSeries: EChartsOption['series'] = series.map(s => ({
    name: s.name,
    type: 'scatter',
    data: s.data,
    symbolSize: s.symbolSize ?? 10,
    ...emphasisFocus,
  }))

  const grid = xFormat === 'currency' || yFormat === 'currency' ? gridCurrency : gridDefault

  const option: EChartsOption = {
    color: colors,
    textStyle,
    tooltip: {
      ...tooltipItem(),
      formatter(params: unknown) {
        const p = params as { seriesName: string, value: [number, number] }
        return `${p.seriesName}<br/>${formatValue(p.value[0], xFormat, currency)} / ${formatValue(p.value[1], yFormat, currency)}`
      },
    },
    xAxis: {
      type: 'value',
      axisLine: cleanAxisLine,
      axisTick: cleanAxisTick,
      axisLabel: { ...cleanAxisLabel, formatter: axisFormatter(xFormat, currency) },
      splitLine: cleanSplitLine,
    },
    yAxis: {
      type: 'value',
      axisLine: cleanAxisLine,
      axisTick: cleanAxisTick,
      axisLabel: { ...cleanAxisLabel, formatter: axisFormatter(yFormat, currency) },
      splitLine: cleanSplitLine,
    },
    series: echartsSeries,
    grid,
    ...animation,
  }

  if (showLegend) {
    option.legend = legendBottom
    option.grid = { ...(option.grid as object), bottom: 48 }
  }

  return overrides ? deepMerge(option, overrides) : option
}
