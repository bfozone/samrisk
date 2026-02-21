import type { EChartsOption } from 'echarts'
import type { ChartOverrides, SunburstChartConfig } from './types'
import { chartColors } from '@/theme/colors'
import { animation, chartSeparatorColor, textStyle, tooltipItem } from './defaults'
import { formatValue } from './format'
import { deepMerge } from './merge'

export function sunburstChart(config: SunburstChartConfig, overrides?: ChartOverrides): EChartsOption {
  const { data, format = 'percent', currency } = config

  const option: EChartsOption = {
    color: chartColors.series,
    textStyle,
    tooltip: {
      ...tooltipItem(),
      formatter(params: unknown) {
        const p = params as { name: string, value: number }
        return `${p.name}: ${formatValue(p.value, format, currency)}`
      },
    },
    series: [
      {
        type: 'sunburst',
        data,
        radius: ['15%', '90%'],
        label: { show: true, formatter: '{b}', rotate: 'radial', fontSize: 11 },
        itemStyle: { borderWidth: 2, borderColor: chartSeparatorColor(), borderRadius: 4 },
        emphasis: { focus: 'ancestor' },
      },
    ],
    ...animation,
  }

  return overrides ? deepMerge(option, overrides) : option
}
