import type { EChartsOption } from 'echarts'
import type { CandlestickChartConfig, ChartOverrides } from './types'
import { chartColors } from '@/theme/colors'
import {
  animation,
  cleanAxisLabel,
  cleanAxisLine,
  cleanAxisTick,
  cleanSplitLine,
  textStyle,
  tooltipCross,
} from './defaults'
import { deepMerge } from './merge'

export function candlestickChart(config: CandlestickChartConfig, overrides?: ChartOverrides): EChartsOption {
  const { categories, data, showDataZoom = false } = config

  const option: EChartsOption = {
    textStyle,
    tooltip: tooltipCross(),
    xAxis: {
      type: 'category',
      data: categories,
      boundaryGap: true,
      axisLine: cleanAxisLine,
      axisTick: cleanAxisTick,
      axisLabel: cleanAxisLabel,
    },
    yAxis: {
      type: 'value',
      scale: true,
      axisLine: cleanAxisLine,
      axisTick: cleanAxisTick,
      axisLabel: cleanAxisLabel,
      splitLine: cleanSplitLine,
    },
    series: [
      {
        type: 'candlestick',
        data,
        itemStyle: {
          color: chartColors.positive,
          color0: chartColors.negative,
          borderColor: chartColors.positive,
          borderColor0: chartColors.negative,
        },
      },
    ],
    grid: { left: 60, right: 16, top: 16, bottom: showDataZoom ? 60 : 28 },
    ...animation,
  }

  if (showDataZoom) {
    option.dataZoom = [
      { type: 'inside', start: 0, end: 100 },
      { type: 'slider', start: 0, end: 100 },
    ]
  }

  return overrides ? deepMerge(option, overrides) : option
}
