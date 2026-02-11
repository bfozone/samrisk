import type { EChartsOption } from 'echarts'
import type { PieChartConfig, ChartOverrides } from './types'
import { chartColors } from '@/theme/preset'
import { tooltipValueFormatter } from './format'
import { tooltipItem, textStyle, animation } from './defaults'
import { deepMerge } from './merge'

export function pieChart(config: PieChartConfig, overrides?: ChartOverrides): EChartsOption {
  const {
    data,
    format = 'percent',
    donut = true,
    showLabels = true,
  } = config

  const radius: [string, string] = donut ? ['40%', '70%'] : ['0%', '70%']

  const option: EChartsOption = {
    color: chartColors.series,
    textStyle,
    tooltip: { ...tooltipItem, valueFormatter: tooltipValueFormatter(format) },
    series: [
      {
        type: 'pie',
        radius,
        data,
        label: {
          show: showLabels,
          formatter: format === 'percent' ? '{b}: {d}%' : '{b}: {c}',
          fontSize: 11,
          color: chartColors.grey,
        },
        emphasis: {
          itemStyle: { shadowBlur: 12, shadowColor: 'rgba(0, 0, 0, 0.15)' },
        },
        itemStyle: { borderColor: '#fff', borderWidth: 2 },
      },
    ],
    ...animation,
  }

  return overrides ? deepMerge(option, overrides) : option
}
