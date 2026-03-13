import type { EChartsOption } from 'echarts'
import type { ChartOverrides, LineChartConfig } from './types'
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
  gridDualAxis,
  legendBottom,
  noSplitLine,
  textStyle,
  tooltipAxis,
} from './defaults'
import { axisFormatter, tooltipValueFormatter } from './format'
import { deepMerge } from './merge'

export function lineChart(config: LineChartConfig, overrides?: ChartOverrides): EChartsOption {
  const {
    categories,
    series,
    format = 'number',
    rightFormat,
    currency,
    zeroLine = false,
    showLegend = series.length > 1,
  } = config

  const hasDualAxis = series.some(s => s.yAxisIndex === 1)
  const effectiveRightFormat = rightFormat ?? format

  const colors = series.map((_, i) => chartColors.series[i % chartColors.series.length]!)

  const yAxisBase = {
    axisLine: cleanAxisLine,
    axisTick: cleanAxisTick,
    axisLabel: { ...cleanAxisLabel },
    splitLine: cleanSplitLine,
    min: 'dataMin' as const,
  }

  const yAxis: EChartsOption['yAxis'] = hasDualAxis
    ? [
        { type: 'value', position: 'left', ...yAxisBase, axisLabel: { ...cleanAxisLabel, formatter: axisFormatter(format, currency) } },
        { type: 'value', position: 'right', ...yAxisBase, axisLabel: { ...cleanAxisLabel, formatter: axisFormatter(effectiveRightFormat, currency) }, splitLine: noSplitLine },
      ]
    : { type: 'value', ...yAxisBase, axisLabel: { ...cleanAxisLabel, formatter: axisFormatter(format, currency) } }

  let grid: EChartsOption['grid']
  if (hasDualAxis)
    grid = gridDualAxis
  else if (format === 'currency')
    grid = gridCurrency
  else grid = gridDefault

  const echartsSeries: EChartsOption['series'] = series.map((s) => {
    const item: Record<string, unknown> = {
      name: s.name,
      type: 'line',
      data: s.data,
      smooth: s.smooth ?? true,
      showSymbol: false,
      ...emphasisFocus,
    }
    if (s.yAxisIndex !== undefined)
      item.yAxisIndex = s.yAxisIndex
    if (s.area) {
      item.areaStyle = {
        opacity: 1,
        color: {
          type: 'linear',
          x: 0,
          y: 0,
          x2: 0,
          y2: 1,
          colorStops: [
            { offset: 0, color: `${colors[series.indexOf(s)]}30` },
            { offset: 1, color: `${colors[series.indexOf(s)]}05` },
          ],
        },
      }
    }
    return item
  })

  if (zeroLine && echartsSeries.length > 0) {
    const first = echartsSeries[0] as Record<string, unknown>
    first.markLine = {
      silent: true,
      symbol: 'none',
      lineStyle: { color: chartColors.grey, type: 'dashed' },
      data: [{ yAxis: 0 }],
    }
  }

  const option: EChartsOption = {
    color: colors,
    textStyle,
    tooltip: { ...tooltipAxis(), valueFormatter: tooltipValueFormatter(format, currency) },
    xAxis: {
      type: 'category',
      data: categories,
      boundaryGap: false,
      axisLine: cleanAxisLine,
      axisTick: cleanAxisTick,
      axisLabel: {
        ...cleanAxisLabel,
        interval: Math.max(0, Math.floor(categories.length / 5) - 1),
      },
    },
    yAxis,
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
