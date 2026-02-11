import { use } from 'echarts/core'
import { CanvasRenderer } from 'echarts/renderers'
import {
  LineChart,
  PieChart,
  BarChart,
  TreemapChart,
  SunburstChart,
  HeatmapChart,
  ScatterChart,
  CandlestickChart,
  BoxplotChart,
  RadarChart,
  GaugeChart,
  SankeyChart,
  TreeChart,
} from 'echarts/charts'
import {
  TooltipComponent,
  GridComponent,
  LegendComponent,
  MarkLineComponent,
  VisualMapComponent,
  DataZoomComponent,
  RadarComponent,
  CalendarComponent,
} from 'echarts/components'

use([
  CanvasRenderer,
  LineChart, PieChart, BarChart, TreemapChart, SunburstChart, HeatmapChart,
  ScatterChart, CandlestickChart, BoxplotChart, RadarChart, GaugeChart, SankeyChart, TreeChart,
  TooltipComponent, GridComponent, LegendComponent, MarkLineComponent, VisualMapComponent,
  DataZoomComponent, RadarComponent, CalendarComponent,
])
