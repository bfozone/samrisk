import { describe, expect, it } from 'vitest'
import { buildAuMChart, buildExposureChart, buildLiquidityChart, buildPnLChart, buildTEChart, buildVaRChart, deriveAuMStat, derivePnLStat, deriveTEStat, deriveVaRStat } from './config'

describe('deriveAuMStat', () => {
  it('returns flat with dash for empty array', () => {
    const stat = deriveAuMStat([], 'EUR')
    expect(stat.value).toBe('-')
    expect(stat.trend).toBe('flat')
  })

  it('returns flat with dash for single item', () => {
    const stat = deriveAuMStat([{ portfolioId: '1', date: '2025-01-01', aum: 1_000_000 }], 'EUR')
    expect(stat.value).toBe('-')
    expect(stat.trend).toBe('flat')
  })

  it('detects upward trend', () => {
    const stat = deriveAuMStat([
      { portfolioId: '1', date: '2025-01-01', aum: 100_000 },
      { portfolioId: '1', date: '2025-01-02', aum: 110_000 },
    ], 'EUR')
    expect(stat.trend).toBe('up')
  })

  it('detects downward trend', () => {
    const stat = deriveAuMStat([
      { portfolioId: '1', date: '2025-01-01', aum: 110_000 },
      { portfolioId: '1', date: '2025-01-02', aum: 100_000 },
    ], 'EUR')
    expect(stat.trend).toBe('down')
  })
})

describe('derivePnLStat', () => {
  it('returns flat with dash for empty array', () => {
    const stat = derivePnLStat([], 'EUR')
    expect(stat.value).toBe('-')
    expect(stat.trend).toBe('flat')
  })

  it('shows positive daily PnL with up trend', () => {
    const stat = derivePnLStat([
      { portfolioId: '1', date: '2025-01-01', daily: 50_000, mtd: 120_000, ytd: 120_000, cumulative: 120_000 },
    ], 'EUR')
    expect(stat.trend).toBe('up')
  })

  it('shows negative daily PnL with down trend', () => {
    const stat = derivePnLStat([
      { portfolioId: '1', date: '2025-01-01', daily: -50_000, mtd: -30_000, ytd: -30_000, cumulative: -30_000 },
    ], 'EUR')
    expect(stat.trend).toBe('down')
  })
})

describe('deriveVaRStat', () => {
  it('returns flat with dash for empty array', () => {
    const stat = deriveVaRStat([])
    expect(stat.value).toBe('-')
    expect(stat.trend).toBe('flat')
  })

  it('returns flat with dash for single item', () => {
    const stat = deriveVaRStat([{ portfolioId: '1', date: '2025-01-01', var95: 1.5, var99: 2.0, cvar95: 1.8 }])
    expect(stat.value).toBe('-')
  })
})

describe('deriveTEStat', () => {
  it('returns flat with dash for empty array', () => {
    const stat = deriveTEStat([])
    expect(stat.value).toBe('-')
    expect(stat.trend).toBe('flat')
  })

  it('shows positive info ratio as up trend', () => {
    const stat = deriveTEStat([
      { portfolioId: '1', date: '2025-01-01', te: 1.5, activeReturn: 0.5, infoRatio: 0.8 },
    ])
    expect(stat.trend).toBe('up')
    expect(stat.value).toBe('1.50%')
  })
})

describe('buildAuMChart', () => {
  it('returns empty categories for empty input', () => {
    const config = buildAuMChart([], 'EUR')
    expect(config.categories).toEqual([])
    expect(config.series[0]!.data).toEqual([])
  })

  it('maps dates to categories and aum to series data', () => {
    const items = [
      { portfolioId: '1', date: '2025-01-01', aum: 100 },
      { portfolioId: '1', date: '2025-01-02', aum: 110 },
    ]
    const config = buildAuMChart(items, 'EUR')
    expect(config.categories).toEqual(['2025-01-01', '2025-01-02'])
    expect(config.series[0]!.data).toEqual([100, 110])
    expect(config.format).toBe('currency')
  })
})

describe('buildPnLChart', () => {
  it('returns empty categories for empty input', () => {
    const config = buildPnLChart([], 'EUR')
    expect(config.categories).toEqual([])
    expect(config.series[0]!.data).toEqual([])
  })

  it('maps cumulative values to series', () => {
    const items = [
      { portfolioId: '1', date: '2025-01-01', daily: 50, mtd: 50, ytd: 50, cumulative: 50 },
      { portfolioId: '1', date: '2025-01-02', daily: -10, mtd: 40, ytd: 40, cumulative: 40 },
    ]
    const config = buildPnLChart(items, 'EUR')
    expect(config.series[0]!.data).toEqual([50, 40])
  })
})

describe('buildVaRChart', () => {
  it('returns empty categories for empty input', () => {
    const config = buildVaRChart([])
    expect(config.categories).toEqual([])
    expect(config.series[0]!.data).toEqual([])
  })

  it('includes both VaR 95% and VaR 99% series', () => {
    const items = [
      { portfolioId: '1', date: '2025-01-01', var95: 1.5, var99: 2.5, cvar95: 2.0 },
    ]
    const config = buildVaRChart(items)
    expect(config.series).toHaveLength(2)
    expect(config.series[0]!.name).toBe('VaR 95%')
    expect(config.series[1]!.name).toBe('VaR 99%')
  })
})

describe('buildExposureChart', () => {
  it('maps categories to pie data', () => {
    const items = [
      { category: 'Equities', value: 100, percentage: 60 },
      { category: 'Bonds', value: 67, percentage: 40 },
    ]
    const config = buildExposureChart(items)
    expect(config.data).toEqual([
      { value: 60, name: 'Equities' },
      { value: 40, name: 'Bonds' },
    ])
  })
})

describe('buildTEChart', () => {
  it('returns empty categories for empty input', () => {
    const config = buildTEChart([])
    expect(config.categories).toEqual([])
    expect(config.series[0]!.data).toEqual([])
  })

  it('includes TE and Info Ratio as dual-axis series', () => {
    const items = [
      { portfolioId: '1', date: '2025-01-01', te: 1.5, activeReturn: 0.3, infoRatio: 0.8 },
    ]
    const config = buildTEChart(items)
    expect(config.series[0]!.name).toBe('Tracking Error')
    expect(config.series[1]!.name).toBe('Info Ratio')
    expect(config.series[1]!.yAxisIndex).toBe(1)
  })
})

describe('buildLiquidityChart', () => {
  it('returns empty categories for empty input', () => {
    const config = buildLiquidityChart([])
    expect(config.categories).toEqual([])
    expect(config.series[0]!.data).toEqual([])
  })

  it('maps horizon to categories and percentage to data', () => {
    const items = [
      { portfolioId: '1', horizon: '1 Day', value: 50_000, percentage: 10 },
      { portfolioId: '1', horizon: '2-7 Days', value: 150_000, percentage: 30 },
    ]
    const config = buildLiquidityChart(items)
    expect(config.categories).toEqual(['1 Day', '2-7 Days'])
    expect(config.series[0]!.data).toEqual([10, 30])
  })
})
