import type { EChartsOption } from 'echarts'
import type { TreemapChartConfig, ChartOverrides } from './types'
import { chartColors } from '@/theme/preset'
import { formatValue } from './format'
import { textStyle, tooltipItem, animation } from './defaults'
import { deepMerge } from './merge'

export function treemapChart(config: TreemapChartConfig, overrides?: ChartOverrides): EChartsOption {
  const { data, format = 'currency', levels = 2 } = config

  const levelStyles = Array.from({ length: levels }, (_, i) => ({
    itemStyle: {
      borderColor: '#fff',
      borderWidth: i === 0 ? 3 : 1,
      gapWidth: i === 0 ? 3 : 1,
      borderRadius: 4,
    },
  }))

  const option: EChartsOption = {
    color: chartColors.series,
    textStyle,
    tooltip: {
      ...tooltipItem,
      formatter(params: unknown) {
        const p = params as { name: string; value: number }
        return `${p.name}: ${formatValue(p.value, format)}`
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
