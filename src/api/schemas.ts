import * as v from 'valibot'

// --- Auth ---

export const UserSchema = v.object({
  id: v.string(),
  name: v.string(),
  initials: v.string(),
  role: v.string(),
})

// --- Portfolios ---

export const PortfolioSchema = v.object({
  id: v.string(),
  name: v.string(),
  currency: v.string(),
  navTotal: v.number(),
})

export const PositionSchema = v.object({
  id: v.string(),
  portfolioId: v.string(),
  instrument: v.string(),
  assetClass: v.string(),
  quantity: v.number(),
  marketValue: v.number(),
  weight: v.number(),
})

// --- Risk ---

export const VaRResultSchema = v.object({
  portfolioId: v.string(),
  date: v.string(),
  var95: v.number(),
  var99: v.number(),
  cvar95: v.number(),
})

export const ExposureBucketSchema = v.object({
  category: v.string(),
  value: v.number(),
  percentage: v.number(),
})

export const AuMSnapshotSchema = v.object({
  portfolioId: v.string(),
  date: v.string(),
  aum: v.number(),
})

export const TrackingErrorResultSchema = v.object({
  portfolioId: v.string(),
  date: v.string(),
  te: v.number(),
  activeReturn: v.number(),
  infoRatio: v.number(),
})

export const PnLResultSchema = v.object({
  portfolioId: v.string(),
  date: v.string(),
  daily: v.number(),
  mtd: v.number(),
  ytd: v.number(),
  cumulative: v.number(),
})

export const LiquidityBucketSchema = v.object({
  portfolioId: v.string(),
  horizon: v.string(),
  value: v.number(),
  percentage: v.number(),
})
