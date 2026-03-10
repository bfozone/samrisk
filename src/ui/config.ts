import { chartColors } from '@/theme/colors'

export const uiDefaults = {
  table: {
    size: 'small' as const,
    stripedRows: true,
  },
  chartCard: {
    size: 'default' as const,
  },
  valueCell: {
    currencyCode: 'EUR',
    locale: 'de-CH',
  },
} as const

export const uiColorPresets = {
  positive: 'var(--color-positive)',
  negative: 'var(--color-negative)',
  warning: 'var(--color-warning)',
  info: 'var(--color-info)',
  meterPalette: [
    chartColors.tealDark,
    chartColors.olive,
    chartColors.amber,
    chartColors.teal,
  ],
  gaugeThresholds: [
    [0.6, chartColors.olive],
    [0.8, chartColors.amber],
    [1, chartColors.negative],
  ] as [number, string][],
  calendarHeatmapRange: [chartColors.negative, chartColors.olive] as [
    string,
    string,
  ],
} as const
