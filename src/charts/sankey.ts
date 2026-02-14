import type { EChartsOption } from 'echarts'
import type { ChartOverrides, SankeyChartConfig } from './types'
import { chartColors } from '@/theme/preset'
import { animation, textStyle, tooltipItem } from './defaults'
import { formatValue } from './format'
import { deepMerge } from './merge'

export function sankeyChart(config: SankeyChartConfig, overrides?: ChartOverrides): EChartsOption {
  const { nodes, links, format = 'currency', currency } = config

  const option: EChartsOption = {
    color: chartColors.series,
    textStyle,
    tooltip: {
      ...tooltipItem,
      triggerOn: 'mousemove',
      formatter(params: unknown) {
        const p = params as { data: { source?: string, target?: string, value?: number, name?: string } }
        if (p.data.source && p.data.target) {
          return `${p.data.source} → ${p.data.target}: ${formatValue(p.data.value ?? 0, format, currency)}`
        }
        return p.data.name ?? ''
      },
    },
    series: [
      {
        type: 'sankey',
        data: nodes,
        links,
        emphasis: { focus: 'adjacency' },
        lineStyle: { color: 'gradient', curveness: 0.5 },
        label: { show: true, fontSize: 11, color: chartColors.charcoal },
        nodeGap: 12,
      },
    ],
    ...animation,
  }

  return overrides ? deepMerge(option, overrides) : option
}
