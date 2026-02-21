import {
  BarChart,
  HeatmapChart,
  LineChart,
  PieChart,
  RadarChart,
  ScatterChart,
} from 'echarts/charts'
import {
  GridComponent,
  LegendComponent,
  MarkLineComponent,
  RadarComponent,
  TooltipComponent,
  VisualMapComponent,
} from 'echarts/components'
import { registerTheme, use } from 'echarts/core'
import { CanvasRenderer } from 'echarts/renderers'

use([
  CanvasRenderer,
  LineChart,
  PieChart,
  BarChart,
  HeatmapChart,
  RadarChart,
  ScatterChart,
  TooltipComponent,
  GridComponent,
  LegendComponent,
  MarkLineComponent,
  VisualMapComponent,
  RadarComponent,
])

const fontFamily = 'Inter, Helvetica, Arial, sans-serif'

registerTheme('samrisk-light', {
  color: ['#2C5969', '#A5B077', '#EAA159', '#61828E', '#e87c78', '#586038', '#e38121', '#ee000c'],
  backgroundColor: 'transparent',
  textStyle: { fontFamily, color: '#778187' },
  categoryAxis: {
    axisLine: { show: false },
    axisTick: { show: false },
    axisLabel: { color: '#778187', fontSize: 11 },
    splitLine: { show: true, lineStyle: { type: 'dashed', color: '#e5e7eb' } },
  },
  valueAxis: {
    axisLine: { show: false },
    axisTick: { show: false },
    axisLabel: { color: '#778187', fontSize: 11 },
    splitLine: { show: true, lineStyle: { type: 'dashed', color: '#e5e7eb' } },
  },
  legend: {
    textStyle: { fontFamily, color: '#778187', fontSize: 11 },
  },
})

registerTheme('samrisk-dark', {
  color: ['#4a9bb0', '#bec993', '#f0b573', '#7ea0ad', '#f09590', '#7a8650', '#f5a94a', '#f44c55'],
  backgroundColor: 'transparent',
  textStyle: { fontFamily, color: '#778187' },
  categoryAxis: {
    axisLine: { show: false },
    axisTick: { show: false },
    axisLabel: { color: '#778187', fontSize: 11 },
    splitLine: { show: true, lineStyle: { type: 'dashed', color: '#2b2e36' } },
  },
  valueAxis: {
    axisLine: { show: false },
    axisTick: { show: false },
    axisLabel: { color: '#778187', fontSize: 11 },
    splitLine: { show: true, lineStyle: { type: 'dashed', color: '#2b2e36' } },
  },
  legend: {
    textStyle: { fontFamily, color: '#778187', fontSize: 11 },
  },
})
