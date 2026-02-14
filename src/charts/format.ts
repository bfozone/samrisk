import type { FormatStyle } from './types'

function compactNumber(v: number): string {
  const abs = Math.abs(v)
  if (abs >= 1_000_000_000) return `${(v / 1_000_000_000).toFixed(1)}B`
  if (abs >= 1_000_000) return `${(v / 1_000_000).toFixed(1)}M`
  if (abs >= 1_000) return `${(v / 1_000).toFixed(0)}K`
  return v.toFixed(0)
}

export function formatValue(v: number, style: FormatStyle, currency = 'EUR'): string {
  switch (style) {
    case 'currency':
      return `${currency} ${compactNumber(v)}`
    case 'percent':
      return `${v.toFixed(2)}%`
    case 'number':
      return compactNumber(v)
  }
}

export function axisFormatter(style: FormatStyle, currency = 'EUR'): (v: number) => string {
  switch (style) {
    case 'currency':
      return (v) => `${currency} ${compactNumber(v)}`
    case 'percent':
      return (v) => `${v}%`
    case 'number':
      return (v) => compactNumber(v)
  }
}

export function tooltipValueFormatter(style: FormatStyle, currency = 'EUR'): (v: unknown) => string {
  return (v) => formatValue(v as number, style, currency)
}
