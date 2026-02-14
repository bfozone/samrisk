import type { EChartsOption } from 'echarts'
import type { BarChartConfig, ChartOverrides } from './types'
import { chartColors } from '@/theme/preset'
import { axisFormatter, tooltipValueFormatter } from './format'
import {
  gridDefault, gridCurrency, gridHorizontalBar, tooltipAxis,
  textStyle, cleanAxisLine, cleanAxisTick, cleanAxisLabel, cleanSplitLine, noSplitLine,
  legendBottom, animation, emphasisFocus,
} from './defaults'
import { deepMerge } from './merge'

export function barChart(config: BarChartConfig, overrides?: ChartOverrides): EChartsOption {
  const {
    categories,
    series,
    format = 'number',
    currency,
    horizontal = false,
    stacked = false,
    showLabels = horizontal,
    barMaxWidth = 48,
    showLegend = series.length > 1,
  } = config

  const colors = series.map((_, i) => chartColors.series[i % chartColors.series.length]!)

  const hasNegative = series.some((s) => s.data.some((v) => v < 0))

  const categoryAxis = {
    type: 'category' as const,
    data: categories,
    axisLine: cleanAxisLine,
    axisTick: cleanAxisTick,
    axisLabel: cleanAxisLabel,
    splitLine: noSplitLine,
  }
  const valueAxis = {
    type: 'value' as const,
    axisLine: cleanAxisLine,
    axisTick: cleanAxisTick,
    axisLabel: { ...cleanAxisLabel, formatter: axisFormatter(format, currency) },
    splitLine: cleanSplitLine,
    ...(horizontal && format === 'percent' && !hasNegative ? { max: 100 } : {}),
  }

  const posRadius = horizontal ? [0, 4, 4, 0] : [4, 4, 0, 0]
  const negRadius = horizontal ? [4, 0, 0, 4] : [0, 0, 4, 4]

  const lastIndex = series.length - 1
  const echartsSeries: EChartsOption['series'] = series.map((s, i) => {
    const isLast = i === lastIndex
    const applyRadius = !stacked || isLast
    const item: Record<string, unknown> = {
      name: s.name,
      type: 'bar',
      data: hasNegative
        ? s.data.map((v) => ({
            value: v,
            itemStyle: {
              color: v >= 0 ? chartColors.positive : chartColors.negative,
              ...(applyRadius ? { borderRadius: v >= 0 ? posRadius : negRadius } : {}),
            },
          }))
        : s.data,
      barMaxWidth,
      barCategoryGap: '5%',
      itemStyle: { borderRadius: applyRadius ? posRadius : 0 },
      ...emphasisFocus,
    }
    if (stacked) item.stack = 'total'
    if (showLabels) {
      const labelFormatter = format === 'percent' ? '{c}%' : '{c}'
      const position = horizontal ? 'right' : 'top'
      item.label = { show: true, position, formatter: labelFormatter, fontSize: 11, color: chartColors.grey }
    }
    return item
  })

  let grid: EChartsOption['grid']
  if (horizontal) grid = gridHorizontalBar
  else if (format === 'currency') grid = gridCurrency
  else grid = gridDefault

  const option: EChartsOption = {
    color: colors,
    textStyle,
    tooltip: { ...tooltipAxis, valueFormatter: tooltipValueFormatter(format, currency) },
    xAxis: horizontal ? valueAxis : categoryAxis,
    yAxis: horizontal ? categoryAxis : valueAxis,
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
