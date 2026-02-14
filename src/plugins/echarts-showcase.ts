import {
  BoxplotChart,
  CandlestickChart,
  GaugeChart,
  SankeyChart,
  SunburstChart,
  TreeChart,
  TreemapChart,
} from 'echarts/charts'
import {
  CalendarComponent,
  DataZoomComponent,
} from 'echarts/components'
import { use } from 'echarts/core'

use([
  TreemapChart,
  SunburstChart,
  CandlestickChart,
  BoxplotChart,
  GaugeChart,
  SankeyChart,
  TreeChart,
  DataZoomComponent,
  CalendarComponent,
])
