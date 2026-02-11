import type { EChartsOption } from 'echarts'
import type { BoxplotChartConfig, ChartOverrides } from './types'
import { chartColors } from '@/theme/preset'
import { axisFormatter } from './format'
import {
  gridDefault, textStyle, tooltipItem,
  cleanAxisLine, cleanAxisTick, cleanAxisLabel, cleanSplitLine, noSplitLine,
  animation,
} from './defaults'
import { deepMerge } from './merge'

export function boxplotChart(config: BoxplotChartConfig, overrides?: ChartOverrides): EChartsOption {
  const {
    categories,
    data,
    format = 'number',
    horizontal = false,
  } = config

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
    axisLabel: { ...cleanAxisLabel, formatter: axisFormatter(format) },
    splitLine: cleanSplitLine,
  }

  const option: EChartsOption = {
    textStyle,
    tooltip: { ...tooltipItem, axisPointer: { type: 'shadow' } },
    xAxis: horizontal ? valueAxis : categoryAxis,
    yAxis: horizontal ? categoryAxis : valueAxis,
    series: [
      {
        type: 'boxplot',
        data,
        itemStyle: { color: chartColors.tealBg, borderColor: chartColors.teal, borderWidth: 1.5 },
      },
    ],
    grid: gridDefault,
    ...animation,
  }

  return overrides ? deepMerge(option, overrides) : option
}
