import { http, HttpResponse } from 'msw'
import type { Portfolio, Position, VaRResult, ExposureBucket, User } from '@/types'

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
]

const positions: Position[] = [
  { id: '1', portfolioId: '1', instrument: 'MSCI World ETF', assetClass: 'Equities', quantity: 10000, marketValue: 175_000_000, weight: 0.35 },
  { id: '2', portfolioId: '1', instrument: 'Euro Govt Bond Fund', assetClass: 'Fixed Income', quantity: 5000, marketValue: 125_000_000, weight: 0.25 },
  { id: '3', portfolioId: '1', instrument: 'PE Fund III', assetClass: 'Alternatives', quantity: 100, marketValue: 75_000_000, weight: 0.15 },
  { id: '4', portfolioId: '1', instrument: 'Cash EUR', assetClass: 'Cash', quantity: 1, marketValue: 50_000_000, weight: 0.10 },
  { id: '5', portfolioId: '1', instrument: 'S&P 500 Put', assetClass: 'Derivatives', quantity: 200, marketValue: 75_000_000, weight: 0.15 },
]

const varDates = lastNWeekdays(5) as [string, string, string, string, string]
const varResults: VaRResult[] = [
  { portfolioId: '1', date: varDates[0], var95: 1.2, var99: 2.1, cvar95: 1.8 },
  { portfolioId: '1', date: varDates[1], var95: 1.5, var99: 2.4, cvar95: 2.0 },
  { portfolioId: '1', date: varDates[2], var95: 1.3, var99: 2.2, cvar95: 1.9 },
  { portfolioId: '1', date: varDates[3], var95: 1.8, var99: 2.9, cvar95: 2.4 },
  { portfolioId: '1', date: varDates[4], var95: 1.6, var99: 2.5, cvar95: 2.1 },
]

const exposures: ExposureBucket[] = [
  { category: 'Equities', value: 175_000_000, percentage: 35 },
  { category: 'Fixed Income', value: 125_000_000, percentage: 25 },
  { category: 'Alternatives', value: 75_000_000, percentage: 15 },
  { category: 'Cash', value: 50_000_000, percentage: 10 },
  { category: 'Derivatives', value: 75_000_000, percentage: 15 },
]

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

  http.get('/api/risk/:id/var', () => HttpResponse.json(varResults)),

  http.get('/api/risk/:id/exposures', () => HttpResponse.json(exposures)),
]
