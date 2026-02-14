import { http, HttpResponse } from 'msw'
import type { VaRResult, ExposureBucket, AuMSnapshot, TrackingErrorResult, PnLResult, LiquidityBucket } from '@/api/schemas'
import { seededRandom, lastNWeekdays } from './seed'

const tradingDays = lastNWeekdays(250)

// --- Generators ---

function generateVaR(portfolioId: string, baseVar95: number, volatility: number, seed: number): VaRResult[] {
  const rand = seededRandom(seed)
  let drift = 0
  return tradingDays.map((date) => {
    drift += (rand() - 0.5) * volatility
    drift *= 0.97
    const var95 = Math.max(0.1, baseVar95 + drift)
    const var99 = var95 * 1.65 + (rand() - 0.5) * 0.2
    const cvar95 = var95 * 1.35 + (rand() - 0.5) * 0.15
    return { portfolioId, date, var95: +var95.toFixed(2), var99: +var99.toFixed(2), cvar95: +cvar95.toFixed(2) }
  })
}

function generateAuM(portfolioId: string, baseNav: number, dailyVol: number, seed: number): AuMSnapshot[] {
  const rand = seededRandom(seed)
  let aum = baseNav
  return tradingDays.map((date) => {
    aum *= 1 + (rand() - 0.48) * dailyVol
    return { portfolioId, date, aum: Math.round(aum) }
  })
}

function generateTrackingError(portfolioId: string, baseTE: number, volatility: number, seed: number): TrackingErrorResult[] {
  const rand = seededRandom(seed)
  let drift = 0
  let cumActiveReturn = 0
  return tradingDays.map((date) => {
    drift += (rand() - 0.5) * volatility
    drift *= 0.96
    const te = Math.max(0.05, baseTE + drift)
    const activeReturn = (rand() - 0.48) * te * 0.4
    cumActiveReturn += activeReturn
    const infoRatio = cumActiveReturn / te
    return { portfolioId, date, te: +te.toFixed(2), activeReturn: +activeReturn.toFixed(3), infoRatio: +infoRatio.toFixed(2) }
  })
}

function generatePnL(portfolioId: string, nav: number, dailyVol: number, seed: number): PnLResult[] {
  const rand = seededRandom(seed)
  let cumulative = 0
  let mtd = 0
  let ytd = 0
  let prevMonth = ''
  let prevYear = ''
  return tradingDays.map((date) => {
    const month = date.slice(0, 7)
    const year = date.slice(0, 4)
    if (month !== prevMonth) { mtd = 0; prevMonth = month }
    if (year !== prevYear) { ytd = 0; prevYear = year }
    const daily = (rand() - 0.48) * dailyVol * nav
    mtd += daily
    ytd += daily
    cumulative += daily
    return { portfolioId, date, daily: Math.round(daily), mtd: Math.round(mtd), ytd: Math.round(ytd), cumulative: Math.round(cumulative) }
  })
}

// --- Generated datasets ---

const varResults: VaRResult[] = [
  ...generateVaR('1', 1.4, 0.3, 42),
  ...generateVaR('2', 2.3, 0.5, 137),
  ...generateVaR('3', 0.8, 0.15, 256),
]

const aumResults: AuMSnapshot[] = [
  ...generateAuM('1', 500_000_000, 0.003, 888),
  ...generateAuM('2', 250_000_000, 0.005, 999),
  ...generateAuM('3', 350_000_000, 0.0015, 1111),
]

const trackingErrorResults: TrackingErrorResult[] = [
  ...generateTrackingError('1', 1.8, 0.2, 77),
  ...generateTrackingError('2', 3.5, 0.4, 199),
  ...generateTrackingError('3', 0.9, 0.1, 311),
]

const pnlResults: PnLResult[] = [
  ...generatePnL('1', 500_000_000, 0.003, 501),
  ...generatePnL('2', 250_000_000, 0.005, 602),
  ...generatePnL('3', 350_000_000, 0.0015, 703),
]

const exposures: Record<string, ExposureBucket[]> = {
  '1': [
    { category: 'Equities', value: 175_000_000, percentage: 35 },
    { category: 'Fixed Income', value: 125_000_000, percentage: 25 },
    { category: 'Alternatives', value: 75_000_000, percentage: 15 },
    { category: 'Cash', value: 50_000_000, percentage: 10 },
    { category: 'Derivatives', value: 75_000_000, percentage: 15 },
  ],
  '2': [
    { category: 'Equities', value: 232_500_000, percentage: 93 },
    { category: 'Cash', value: 17_500_000, percentage: 7 },
  ],
  '3': [
    { category: 'Fixed Income', value: 245_000_000, percentage: 70 },
    { category: 'Derivatives', value: 87_500_000, percentage: 25 },
    { category: 'Cash', value: 17_500_000, percentage: 5 },
  ],
}

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

// --- Handlers ---

export const riskHandlers = [
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
