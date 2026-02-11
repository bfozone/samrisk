import type { EChartsOption } from 'echarts'

export type FormatStyle = 'currency' | 'percent' | 'number'

// --- Line ---

export interface LineSeries {
  name: string
  data: number[]
  yAxisIndex?: number
  area?: boolean
  smooth?: boolean
}

export interface LineChartConfig {
  categories: string[]
  series: LineSeries[]
  format?: FormatStyle
  rightFormat?: FormatStyle
  zeroLine?: boolean
  showLegend?: boolean
}

// --- Bar ---

export interface BarSeries {
  name: string
  data: number[]
}

export interface BarChartConfig {
  categories: string[]
  series: BarSeries[]
  format?: FormatStyle
  horizontal?: boolean
  stacked?: boolean
  showLabels?: boolean
  barMaxWidth?: number
  showLegend?: boolean
}

// --- Pie ---

export interface PieDataItem {
  name: string
  value: number
}

export interface PieChartConfig {
  data: PieDataItem[]
  format?: FormatStyle
  donut?: boolean
  showLabels?: boolean
}

// --- Treemap ---

export interface TreemapNode {
  name: string
  value: number
  children?: TreemapNode[]
}

export interface TreemapChartConfig {
  data: TreemapNode[]
  format?: FormatStyle
  levels?: number
}

// --- Sunburst ---

export interface SunburstNode {
  name: string
  value?: number
  children?: SunburstNode[]
}

export interface SunburstChartConfig {
  data: SunburstNode[]
  format?: FormatStyle
}

// --- Heatmap ---

export interface HeatmapChartConfig {
  xLabels: string[]
  yLabels: string[]
  data: [number, number, number][]
  format?: FormatStyle
  min?: number
  max?: number
  colorRange?: [string, string]
}

// --- Scatter ---

export interface ScatterSeries {
  name: string
  data: [number, number][]
  symbolSize?: number
}

export interface ScatterChartConfig {
  series: ScatterSeries[]
  xFormat?: FormatStyle
  yFormat?: FormatStyle
  showLegend?: boolean
}

// --- Candlestick ---

export interface CandlestickChartConfig {
  categories: string[]
  /** Each item: [open, close, low, high] */
  data: [number, number, number, number][]
  showDataZoom?: boolean
}

// --- Boxplot ---

export interface BoxplotChartConfig {
  categories: string[]
  /** Each item: [min, Q1, median, Q3, max] */
  data: [number, number, number, number, number][]
  format?: FormatStyle
  horizontal?: boolean
}

// --- Radar ---

export interface RadarIndicator {
  name: string
  max: number
}

export interface RadarSeries {
  name: string
  data: number[]
}

export interface RadarChartConfig {
  indicators: RadarIndicator[]
  series: RadarSeries[]
  showLegend?: boolean
}

// --- Gauge ---

export interface GaugeChartConfig {
  value: number
  name?: string
  min?: number
  max?: number
  /** Array of [endPercent, color] thresholds for color bands */
  thresholds?: [number, string][]
}

// --- Sankey ---

export interface SankeyNode {
  name: string
}

export interface SankeyLink {
  source: string
  target: string
  value: number
}

export interface SankeyChartConfig {
  nodes: SankeyNode[]
  links: SankeyLink[]
  format?: FormatStyle
}

// --- Tree ---

export interface TreeNodeData {
  name: string
  children?: TreeNodeData[]
}

export interface TreeChartConfig {
  data: TreeNodeData
  orient?: 'LR' | 'RL' | 'TB' | 'BT'
  layout?: 'orthogonal' | 'radial'
}

export type ChartOverrides = EChartsOption
