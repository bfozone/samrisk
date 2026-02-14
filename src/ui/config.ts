import { chartColors } from '@/theme/preset'

export const uiComponentDefaults = {
  button: {
    severity: 'primary' as const,
    size: undefined as 'small' | 'large' | undefined,
  },
  card: {
    compactBodyPadding: '1rem',
  },
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
  select: {
    size: undefined as 'small' | 'large' | undefined,
  },
  tag: {},
  inputText: {
    size: undefined as 'small' | 'large' | undefined,
  },
} as const

export const uiColorPresets = {
  positive: 'var(--app-color-positive)',
  negative: 'var(--app-color-negative)',
  warning: 'var(--app-color-warning)',
  info: 'var(--app-color-info)',
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
  calendarHeatmapRange: [chartColors.negative, chartColors.olive] as [string, string],
} as const
