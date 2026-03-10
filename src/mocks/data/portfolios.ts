import type { Portfolio, Position } from '@/api/schemas'
import { http, HttpResponse } from 'msw'

const portfolios: Portfolio[] = [
  { id: '1', name: 'Global Multi-Asset', benchmarkName: '60/40 MSCI World/BBG Euro Agg', currency: 'EUR', navTotal: 500_000_000, manager: 'Maria Schmidt', inceptionDate: '2018-03-15' },
  { id: '2', name: 'European Equity', benchmarkName: 'EURO STOXX 50', currency: 'EUR', navTotal: 250_000_000, manager: 'Thomas Weber', inceptionDate: '2020-01-10' },
  { id: '3', name: 'Fixed Income Absolute Return', benchmarkName: '€STR + 150bps', currency: 'EUR', navTotal: 350_000_000, manager: 'Sophie Dubois', inceptionDate: '2021-06-01' },
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

export const portfolioHandlers = [
  http.get('/api/portfolios', () => HttpResponse.json(portfolios)),

  http.get('/api/portfolios/:id/positions', ({ params }) => {
    const filtered = positions.filter(p => p.portfolioId === params.id)
    return HttpResponse.json(filtered)
  }),
]
