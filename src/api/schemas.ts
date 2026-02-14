import * as v from 'valibot'

// --- Auth ---

export const UserSchema = v.object({
  id: v.string(),
  name: v.string(),
  initials: v.string(),
  role: v.string(),
})
export type User = v.InferOutput<typeof UserSchema>

// --- Portfolios ---

export const PortfolioSchema = v.object({
  id: v.string(),
  name: v.string(),
  currency: v.string(),
  navTotal: v.number(),
})
export type Portfolio = v.InferOutput<typeof PortfolioSchema>

export const PositionSchema = v.object({
  id: v.string(),
  portfolioId: v.string(),
  instrument: v.string(),
  assetClass: v.string(),
  quantity: v.number(),
  marketValue: v.number(),
  weight: v.number(),
})
export type Position = v.InferOutput<typeof PositionSchema>

// --- Risk ---

export const VaRResultSchema = v.object({
  portfolioId: v.string(),
  date: v.string(),
  var95: v.number(),
  var99: v.number(),
  cvar95: v.number(),
})
export type VaRResult = v.InferOutput<typeof VaRResultSchema>

export const ExposureBucketSchema = v.object({
  category: v.string(),
  value: v.number(),
  percentage: v.number(),
})
export type ExposureBucket = v.InferOutput<typeof ExposureBucketSchema>

export const AuMSnapshotSchema = v.object({
  portfolioId: v.string(),
  date: v.string(),
  aum: v.number(),
})
export type AuMSnapshot = v.InferOutput<typeof AuMSnapshotSchema>

export const TrackingErrorResultSchema = v.object({
  portfolioId: v.string(),
  date: v.string(),
  te: v.number(),
  activeReturn: v.number(),
  infoRatio: v.number(),
})
export type TrackingErrorResult = v.InferOutput<typeof TrackingErrorResultSchema>

export const PnLResultSchema = v.object({
  portfolioId: v.string(),
  date: v.string(),
  daily: v.number(),
  mtd: v.number(),
  ytd: v.number(),
  cumulative: v.number(),
})
export type PnLResult = v.InferOutput<typeof PnLResultSchema>

export const LiquidityBucketSchema = v.object({
  portfolioId: v.string(),
  horizon: v.string(),
  value: v.number(),
  percentage: v.number(),
})
export type LiquidityBucket = v.InferOutput<typeof LiquidityBucketSchema>
