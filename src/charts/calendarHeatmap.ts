import type { EChartsOption } from 'echarts'
import { chartColors } from '@/theme/preset'
import { textStyle, tooltipItem, animation } from './defaults'
import { deepMerge } from './merge'
import type { ChartOverrides } from './types'

export interface CalendarHeatmapConfig {
  /** Data as [date-string, value] pairs, e.g. ['2025-01-15', 3.2] */
  data: [string, number][]
  /** Year to display */
  year: string
  /** Min value for color mapping */
  min?: number
  /** Max value for color mapping */
  max?: number
  /** Color range [low, high] */
  colorRange?: [string, string]
  /** Tooltip value format */
  format?: (v: number) => string
}

export function calendarHeatmapChart(config: CalendarHeatmapConfig, overrides?: ChartOverrides): EChartsOption {
  const values = config.data.map(d => d[1])
  const {
    data,
    year,
    min = values.length ? Math.min(...values) : 0,
    max = values.length ? Math.max(...values) : 1,
    colorRange = [chartColors.tealBg, chartColors.tealDark],
    format = (v: number) => v.toFixed(1),
  } = config

  const option: EChartsOption = {
    textStyle,
    tooltip: {
      ...tooltipItem,
      formatter(params: unknown) {
        const p = params as { value: [string, number] }
        return `${p.value[0]}: ${format(p.value[1])}`
      },
    },
    visualMap: {
      min,
      max,
      calculable: true,
      orient: 'horizontal',
      left: 'center',
      bottom: 0,
      inRange: { color: colorRange },
      textStyle: { fontSize: 11, color: chartColors.grey },
    },
    calendar: {
      top: 20,
      left: 40,
      right: 16,
      bottom: 50,
      range: year,
      cellSize: ['auto', 16],
      splitLine: { show: true, lineStyle: { color: '#e5e7eb', width: 1 } },
      itemStyle: { borderColor: '#fff', borderWidth: 2 },
      yearLabel: { show: false },
      dayLabel: { firstDay: 1, nameMap: 'en', color: chartColors.grey, fontSize: 10 },
      monthLabel: { color: chartColors.grey, fontSize: 11 },
    },
    series: [
      {
        type: 'heatmap',
        coordinateSystem: 'calendar',
        data,
        emphasis: { itemStyle: { shadowBlur: 8, shadowColor: 'rgba(0, 0, 0, 0.2)' } },
      },
    ],
    ...animation,
  }

  return overrides ? deepMerge(option, overrides) : option
}
