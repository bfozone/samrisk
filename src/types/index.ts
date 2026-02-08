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

export interface User {
  id: string
  name: string
  initials: string
  role: string
}
