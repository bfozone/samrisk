import type { EChartsOption } from 'echarts'
import type { ChartOverrides, TreeChartConfig } from './types'
import { chartColors } from '@/theme/preset'
import { textStyle, tooltipItem } from './defaults'
import { deepMerge } from './merge'

export function treeChart(config: TreeChartConfig, overrides?: ChartOverrides): EChartsOption {
  const { data, orient = 'LR', layout = 'orthogonal' } = config

  const option: EChartsOption = {
    textStyle,
    tooltip: { ...tooltipItem, triggerOn: 'mousemove' },
    series: [
      {
        type: 'tree',
        data: [data],
        orient,
        layout,
        symbol: 'circle',
        symbolSize: 10,
        edgeShape: 'polyline',
        initialTreeDepth: -1,
        label: {
          position: orient === 'LR' ? 'right' : 'top',
          verticalAlign: 'middle',
          fontSize: 12,
          color: chartColors.charcoal,
        },
        leaves: {
          label: { position: orient === 'LR' ? 'right' : 'bottom' },
        },
        lineStyle: { color: '#d5d7d9', width: 1.5, curveness: 0.5 },
        itemStyle: { color: chartColors.teal, borderColor: chartColors.tealDark, borderWidth: 1.5 },
        emphasis: { focus: 'descendant' },
        expandAndCollapse: true,
        animationDuration: 400,
        animationDurationUpdate: 500,
      },
    ],
  }

  return overrides ? deepMerge(option, overrides) : option
}
