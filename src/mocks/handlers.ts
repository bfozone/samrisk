import { http, HttpResponse } from 'msw'
import type { Portfolio, Position, VaRResult, ExposureBucket, AuMSnapshot, TrackingErrorResult, PnLResult, LiquidityBucket, User } from '@/types'

function lastNWeekdays(n: number): string[] {
  const dates: string[] = []
  const d = new Date()
  while (dates.length < n) {
    d.setDate(d.getDate() - 1)
    const day = d.getDay()
    if (day !== 0 && day !== 6) {
      dates.push(d.toISOString().slice(0, 10))
    }
  }
  return dates.reverse()
}

const portfolios: Portfolio[] = [
  { id: '1', name: 'Global Multi-Asset', currency: 'EUR', navTotal: 500_000_000 },
  { id: '2', name: 'European Equity', currency: 'EUR', navTotal: 250_000_000 },
  { id: '3', name: 'Fixed Income Absolute Return', currency: 'EUR', navTotal: 350_000_000 },
]

const positions: Position[] = [
  // Portfolio 1 - Global Multi-Asset
  { id: '101', portfolioId: '1', instrument: 'MSCI World ETF', assetClass: 'Equities', quantity: 10_000, marketValue: 175_000_000, weight: 0.35 },
  { id: '102', portfolioId: '1', instrument: 'Euro Govt Bond Fund', assetClass: 'Fixed Income', quantity: 5_000, marketValue: 125_000_000, weight: 0.25 },
  { id: '103', portfolioId: '1', instrument: 'PE Fund III', assetClass: 'Alternatives', quantity: 100, marketValue: 75_000_000, weight: 0.15 },
  { id: '104', portfolioId: '1', instrument: 'Cash EUR', assetClass: 'Cash', quantity: 1, marketValue: 50_000_000, weight: 0.10 },
  { id: '105', portfolioId: '1', instrument: 'S&P 500 Put', assetClass: 'Derivatives', quantity: 200, marketValue: 75_000_000, weight: 0.15 },

  // Portfolio 2 - European Equity
  { id: '201', portfolioId: '2', instrument: 'EURO STOXX 50 ETF', assetClass: 'Equities', quantity: 15_000, marketValue: 82_500_000, weight: 0.33 },
  { id: '202', portfolioId: '2', instrument: 'SAP SE', assetClass: 'Equities', quantity: 120_000, marketValue: 45_000_000, weight: 0.18 },
  { id: '203', portfolioId: '2', instrument: 'ASML Holding NV', assetClass: 'Equities', quantity: 50_000, marketValue: 42_500_000, weight: 0.17 },
  { id: '204', portfolioId: '2', instrument: 'LVMH Moet Hennessy', assetClass: 'Equities', quantity: 40_000, marketValue: 35_000_000, weight: 0.14 },
  { id: '205', portfolioId: '2', instrument: 'Novo Nordisk A/S', assetClass: 'Equities', quantity: 60_000, marketValue: 27_500_000, weight: 0.11 },
  { id: '206', portfolioId: '2', instrument: 'Cash EUR', assetClass: 'Cash', quantity: 1, marketValue: 17_500_000, weight: 0.07 },

  // Portfolio 3 - Fixed Income Absolute Return
  { id: '301', portfolioId: '3', instrument: 'German Bund 10Y', assetClass: 'Fixed Income', quantity: 800, marketValue: 84_000_000, weight: 0.24 },
  { id: '302', portfolioId: '3', instrument: 'French OAT 5Y', assetClass: 'Fixed Income', quantity: 600, marketValue: 63_000_000, weight: 0.18 },
  { id: '303', portfolioId: '3', instrument: 'EUR IG Credit ETF', assetClass: 'Fixed Income', quantity: 8_000, marketValue: 56_000_000, weight: 0.16 },
  { id: '304', portfolioId: '3', instrument: 'EUR HY Bond Fund', assetClass: 'Fixed Income', quantity: 3_000, marketValue: 42_000_000, weight: 0.12 },
  { id: '305', portfolioId: '3', instrument: 'EUR Interest Rate Swap 5Y', assetClass: 'Derivatives', quantity: 500, marketValue: 52_500_000, weight: 0.15 },
  { id: '306', portfolioId: '3', instrument: 'CDS iTraxx Europe', assetClass: 'Derivatives', quantity: 300, marketValue: 35_000_000, weight: 0.10 },
  { id: '307', portfolioId: '3', instrument: 'Cash EUR', assetClass: 'Cash', quantity: 1, marketValue: 17_500_000, weight: 0.05 },
]

const varDates = lastNWeekdays(250)

// Seeded pseudo-random for reproducible mock data
function seededRandom(seed: number) {
  let s = seed
  return () => {
    s = (s * 1664525 + 1013904223) & 0x7fffffff
    return s / 0x7fffffff
  }
}

function generateVaR(
  portfolioId: string,
  baseVar95: number,
  volatility: number,
  seed: number,
): VaRResult[] {
  const rand = seededRandom(seed)
  let drift = 0
  return varDates.map((date) => {
    drift += (rand() - 0.5) * volatility
    drift *= 0.97 // mean-revert
    const var95 = Math.max(0.1, baseVar95 + drift)
    const var99 = var95 * 1.65 + (rand() - 0.5) * 0.2
    const cvar95 = var95 * 1.35 + (rand() - 0.5) * 0.15
    return {
      portfolioId,
      date,
      var95: +var95.toFixed(2),
      var99: +var99.toFixed(2),
      cvar95: +cvar95.toFixed(2),
    }
  })
}

function generateAuM(
  portfolioId: string,
  baseNav: number,
  dailyVol: number,
  seed: number,
): AuMSnapshot[] {
  const rand = seededRandom(seed)
  let aum = baseNav
  return varDates.map((date) => {
    aum *= 1 + (rand() - 0.48) * dailyVol
    return {
      portfolioId,
      date,
      aum: Math.round(aum),
    }
  })
}

const aumResults: AuMSnapshot[] = [
  ...generateAuM('1', 500_000_000, 0.003, 888),
  ...generateAuM('2', 250_000_000, 0.005, 999),
  ...generateAuM('3', 350_000_000, 0.0015, 1111),
]

const varResults: VaRResult[] = [
  ...generateVaR('1', 1.4, 0.3, 42),   // Global Multi-Asset: moderate
  ...generateVaR('2', 2.3, 0.5, 137),  // European Equity: higher vol
  ...generateVaR('3', 0.8, 0.15, 256), // Fixed Income AR: lower vol
]

function generateTrackingError(
  portfolioId: string,
  baseTE: number,
  volatility: number,
  seed: number,
): TrackingErrorResult[] {
  const rand = seededRandom(seed)
  let drift = 0
  let cumActiveReturn = 0
  return varDates.map((date) => {
    drift += (rand() - 0.5) * volatility
    drift *= 0.96
    const te = Math.max(0.05, baseTE + drift)
    const activeReturn = (rand() - 0.48) * te * 0.4
    cumActiveReturn += activeReturn
    const infoRatio = cumActiveReturn / te
    return {
      portfolioId,
      date,
      te: +te.toFixed(2),
      activeReturn: +activeReturn.toFixed(3),
      infoRatio: +infoRatio.toFixed(2),
    }
  })
}

const trackingErrorResults: TrackingErrorResult[] = [
  ...generateTrackingError('1', 1.8, 0.2, 77),   // Multi-Asset: moderate TE
  ...generateTrackingError('2', 3.5, 0.4, 199),  // Equity: high TE
  ...generateTrackingError('3', 0.9, 0.1, 311),  // FI AR: low TE
]

function generatePnL(
  portfolioId: string,
  nav: number,
  dailyVol: number,
  seed: number,
): PnLResult[] {
  const rand = seededRandom(seed)
  let cumulative = 0
  let mtd = 0
  let ytd = 0
  let prevMonth = ''
  let prevYear = ''
  return varDates.map((date) => {
    const month = date.slice(0, 7)
    const year = date.slice(0, 4)
    if (month !== prevMonth) { mtd = 0; prevMonth = month }
    if (year !== prevYear) { ytd = 0; prevYear = year }
    const daily = (rand() - 0.48) * dailyVol * nav
    mtd += daily
    ytd += daily
    cumulative += daily
    return {
      portfolioId,
      date,
      daily: Math.round(daily),
      mtd: Math.round(mtd),
      ytd: Math.round(ytd),
      cumulative: Math.round(cumulative),
    }
  })
}

const pnlResults: PnLResult[] = [
  ...generatePnL('1', 500_000_000, 0.003, 501),   // ~1.5M daily swings
  ...generatePnL('2', 250_000_000, 0.005, 602),   // ~1.25M, more volatile
  ...generatePnL('3', 350_000_000, 0.0015, 703),  // ~525K, lower vol
]

const liquidityData: Record<string, LiquidityBucket[]> = {
  '1': [
    { portfolioId: '1', horizon: '1 Day', value: 50_000_000, percentage: 10 },
    { portfolioId: '1', horizon: '2-7 Days', value: 175_000_000, percentage: 35 },
    { portfolioId: '1', horizon: '8-30 Days', value: 125_000_000, percentage: 25 },
    { portfolioId: '1', horizon: '31-90 Days', value: 75_000_000, percentage: 15 },
    { portfolioId: '1', horizon: '>90 Days', value: 75_000_000, percentage: 15 },
  ],
  '2': [
    { portfolioId: '2', horizon: '1 Day', value: 17_500_000, percentage: 7 },
    { portfolioId: '2', horizon: '2-7 Days', value: 157_500_000, percentage: 63 },
    { portfolioId: '2', horizon: '8-30 Days', value: 62_500_000, percentage: 25 },
    { portfolioId: '2', horizon: '31-90 Days', value: 12_500_000, percentage: 5 },
  ],
  '3': [
    { portfolioId: '3', horizon: '1 Day', value: 17_500_000, percentage: 5 },
    { portfolioId: '3', horizon: '2-7 Days', value: 84_000_000, percentage: 24 },
    { portfolioId: '3', horizon: '8-30 Days', value: 119_000_000, percentage: 34 },
    { portfolioId: '3', horizon: '31-90 Days', value: 87_500_000, percentage: 25 },
    { portfolioId: '3', horizon: '>90 Days', value: 42_000_000, percentage: 12 },
  ],
}

const exposures: Record<string, ExposureBucket[]> = {
  // Portfolio 1 - Global Multi-Asset
  '1': [
    { category: 'Equities', value: 175_000_000, percentage: 35 },
    { category: 'Fixed Income', value: 125_000_000, percentage: 25 },
    { category: 'Alternatives', value: 75_000_000, percentage: 15 },
    { category: 'Cash', value: 50_000_000, percentage: 10 },
    { category: 'Derivatives', value: 75_000_000, percentage: 15 },
  ],
  // Portfolio 2 - European Equity
  '2': [
    { category: 'Equities', value: 232_500_000, percentage: 93 },
    { category: 'Cash', value: 17_500_000, percentage: 7 },
  ],
  // Portfolio 3 - Fixed Income Absolute Return
  '3': [
    { category: 'Fixed Income', value: 245_000_000, percentage: 70 },
    { category: 'Derivatives', value: 87_500_000, percentage: 25 },
    { category: 'Cash', value: 17_500_000, percentage: 5 },
  ],
}

const currentUser: User = {
  id: '1',
  name: 'Benjamin Fink',
  initials: 'BF',
  role: 'Head Investment Performance & Risk Controlling',
}

export const handlers = [
  http.get('/api/auth/me', () => HttpResponse.json(currentUser)),

  http.get('/api/portfolios', () => HttpResponse.json(portfolios)),

  http.get('/api/portfolios/:id/positions', ({ params }) => {
    const filtered = positions.filter((p) => p.portfolioId === params.id)
    return HttpResponse.json(filtered)
  }),

  http.get('/api/risk/:id/var', ({ params }) => {
    const filtered = varResults.filter((v) => v.portfolioId === params.id)
    return HttpResponse.json(filtered)
  }),

  http.get('/api/risk/:id/exposures', ({ params }) => {
    const data = exposures[params.id as string] ?? []
    return HttpResponse.json(data)
  }),

  http.get('/api/risk/:id/aum', ({ params }) => {
    const filtered = aumResults.filter((a) => a.portfolioId === params.id)
    return HttpResponse.json(filtered)
  }),

  http.get('/api/risk/:id/tracking-error', ({ params }) => {
    const filtered = trackingErrorResults.filter((t) => t.portfolioId === params.id)
    return HttpResponse.json(filtered)
  }),

  http.get('/api/risk/:id/pnl', ({ params }) => {
    const filtered = pnlResults.filter((p) => p.portfolioId === params.id)
    return HttpResponse.json(filtered)
  }),

  http.get('/api/risk/:id/liquidity', ({ params }) => {
    const data = liquidityData[params.id as string] ?? []
    return HttpResponse.json(data)
  }),
]
