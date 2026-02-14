import { use } from 'echarts/core'
import { CanvasRenderer } from 'echarts/renderers'
import {
  LineChart,
  PieChart,
  BarChart,
  HeatmapChart,
  RadarChart,
  ScatterChart,
} from 'echarts/charts'
import {
  TooltipComponent,
  GridComponent,
  LegendComponent,
  MarkLineComponent,
  VisualMapComponent,
  RadarComponent,
} from 'echarts/components'

use([
  CanvasRenderer,
  LineChart, PieChart, BarChart, HeatmapChart, RadarChart, ScatterChart,
  TooltipComponent, GridComponent, LegendComponent, MarkLineComponent,
  VisualMapComponent, RadarComponent,
])
