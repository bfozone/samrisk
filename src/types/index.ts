export interface Portfolio {
  id: string
  name: string
  currency: string
  navTotal: number
}

export interface Position {
  id: string
  portfolioId: string
  instrument: string
  assetClass: string
  quantity: number
  marketValue: number
  weight: number
}

export interface VaRResult {
  portfolioId: string
  date: string
  var95: number
  var99: number
  cvar95: number
}

export interface ExposureBucket {
  category: string
  value: number
  percentage: number
}

export interface AuMSnapshot {
  portfolioId: string
  date: string
  aum: number
}

export interface TrackingErrorResult {
  portfolioId: string
  date: string
  te: number
  activeReturn: number
  infoRatio: number
}

export interface PnLResult {
  portfolioId: string
  date: string
  daily: number
  mtd: number
  ytd: number
  cumulative: number
}

export interface LiquidityBucket {
  portfolioId: string
  horizon: string
  value: number
  percentage: number
}

export interface User {
  id: string
  name: string
  initials: string
  role: string
}
