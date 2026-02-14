import { describe, expect, it } from 'vitest'
import { axisFormatter, formatValue } from '@/charts/format'

describe('chart format helpers', () => {
  it('formats currency values with EUR prefix', () => {
    expect(formatValue(1_250_000, 'currency')).toBe('EUR 1.3M')
  })

  it('formats percent values with two decimals', () => {
    expect(formatValue(1.234, 'percent')).toBe('1.23%')
  })

  it('keeps percent axis labels compact', () => {
    expect(axisFormatter('percent')(12.5)).toBe('12.5%')
  })
})
