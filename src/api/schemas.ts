import * as v from 'valibot'

// --- Shared validators ---

const IsoDate = v.pipe(v.string(), v.regex(/^\d{4}-\d{2}-\d{2}$/))
const Currency = v.picklist(['EUR', 'USD', 'GBP', 'CHF'])
const NonNegative = v.pipe(v.number(), v.minValue(0))

// --- Auth ---

export const UserSchema = v.object({
  id: v.string(),
  name: v.pipe(v.string(), v.minLength(1)),
  initials: v.pipe(v.string(), v.minLength(1)),
  role: v.string(),
})
export type User = v.InferOutput<typeof UserSchema>

// --- Portfolios ---

export const PortfolioSchema = v.object({
  id: v.string(),
  name: v.string(),
  benchmarkName: v.string(),
  currency: Currency,
  navTotal: NonNegative,
  manager: v.string(),
  inceptionDate: IsoDate,
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
  date: IsoDate,
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
  date: IsoDate,
  aum: NonNegative,
})
export type AuMSnapshot = v.InferOutput<typeof AuMSnapshotSchema>

export const TrackingErrorResultSchema = v.object({
  portfolioId: v.string(),
  date: IsoDate,
  te: NonNegative,
  activeReturn: v.number(),
  infoRatio: v.number(),
})
export type TrackingErrorResult = v.InferOutput<typeof TrackingErrorResultSchema>

export const PnLResultSchema = v.object({
  portfolioId: v.string(),
  date: IsoDate,
  daily: v.number(),
  mtd: v.number(),
  ytd: v.number(),
  cumulative: v.number(),
})
export type PnLResult = v.InferOutput<typeof PnLResultSchema>

export const LiquidityBucketSchema = v.object({
  portfolioId: v.string(),
  horizon: v.string(),
  value: NonNegative,
  percentage: v.number(),
})
export type LiquidityBucket = v.InferOutput<typeof LiquidityBucketSchema>

// --- Performance ---

export const PerformanceSeriesSchema = v.object({
  date: IsoDate,
  portfolioReturn: v.number(),
  benchmarkReturn: v.number(),
  activeReturn: v.number(),
})
export type PerformanceSeries = v.InferOutput<typeof PerformanceSeriesSchema>

// --- Summary (aggregate) ---

export const SummaryResponseSchema = v.object({
  aum: v.array(AuMSnapshotSchema),
  pnl: v.array(PnLResultSchema),
  var: v.array(VaRResultSchema),
  trackingError: v.array(TrackingErrorResultSchema),
  exposures: v.array(ExposureBucketSchema),
  liquidity: v.array(LiquidityBucketSchema),
  performance: v.array(PerformanceSeriesSchema),
})
export type SummaryResponse = v.InferOutput<typeof SummaryResponseSchema>
