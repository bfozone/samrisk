import { describe, expect, it } from 'vitest'
import { axisFormatter, formatValue, tooltipValueFormatter } from '@/charts/format'

describe('formatValue', () => {
  it('formats currency values with EUR prefix', () => {
    expect(formatValue(1_250_000, 'currency')).toBe('EUR 1.3M')
  })

  it('formats currency with custom currency code', () => {
    expect(formatValue(1_250_000, 'currency', 'USD')).toBe('USD 1.3M')
  })

  it('formats percent values with two decimals', () => {
    expect(formatValue(1.234, 'percent')).toBe('1.23%')
  })

  it('formats number style without currency prefix', () => {
    expect(formatValue(1_250_000, 'number')).toBe('1.3M')
  })

  it('formats negative values', () => {
    expect(formatValue(-500_000, 'currency')).toBe('EUR -500K')
  })

  it('formats billions', () => {
    expect(formatValue(2_500_000_000, 'currency')).toBe('EUR 2.5B')
  })

  it('formats thousands', () => {
    expect(formatValue(5_000, 'currency')).toBe('EUR 5K')
  })

  it('formats small values without suffix', () => {
    expect(formatValue(42, 'number')).toBe('42')
  })
})

describe('axisFormatter', () => {
  it('keeps percent axis labels compact', () => {
    expect(axisFormatter('percent')(12.5)).toBe('12.5%')
  })

  it('formats currency axis with prefix', () => {
    expect(axisFormatter('currency')(1_000_000)).toBe('EUR 1.0M')
  })

  it('formats currency axis with custom currency', () => {
    expect(axisFormatter('currency', 'USD')(1_000_000)).toBe('USD 1.0M')
  })

  it('formats number axis without prefix', () => {
    expect(axisFormatter('number')(5_000)).toBe('5K')
  })
})

describe('tooltipValueFormatter', () => {
  it('formats tooltip value as currency', () => {
    const fmt = tooltipValueFormatter('currency')
    expect(fmt(1_250_000)).toBe('EUR 1.3M')
  })

  it('formats tooltip value as percent', () => {
    const fmt = tooltipValueFormatter('percent')
    expect(fmt(1.234)).toBe('1.23%')
  })

  it('uses custom currency', () => {
    const fmt = tooltipValueFormatter('currency', 'GBP')
    expect(fmt(1_000_000)).toBe('GBP 1.0M')
  })
})
