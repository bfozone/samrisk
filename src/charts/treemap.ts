import type { EChartsOption } from 'echarts'
import type { ChartOverrides, TreemapChartConfig } from './types'
import { chartColors } from '@/theme/colors'
import { animation, chartSeparatorColor, textStyle, tooltipItem } from './defaults'
import { formatValue } from './format'
import { deepMerge } from './merge'

export function treemapChart(config: TreemapChartConfig, overrides?: ChartOverrides): EChartsOption {
  const { data, format = 'currency', currency, levels = 2 } = config

  const levelStyles = Array.from({ length: levels }, (_, i) => ({
    itemStyle: {
      borderColor: chartSeparatorColor(),
      borderWidth: i === 0 ? 3 : 1,
      gapWidth: i === 0 ? 3 : 1,
      borderRadius: 4,
    },
  }))

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
        type: 'treemap',
        data,
        roam: false,
        nodeClick: false,
        breadcrumb: { show: false },
        levels: levelStyles,
        label: { show: true, formatter: '{b}', fontSize: 11 },
      },
    ],
    ...animation,
  }

  return overrides ? deepMerge(option, overrides) : option
}
