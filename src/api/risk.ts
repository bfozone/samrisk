import apiClient, { parseArray } from './client'
import {
  AuMSnapshotSchema,
  ExposureBucketSchema,
  LiquidityBucketSchema,
  PnLResultSchema,
  TrackingErrorResultSchema,
  VaRResultSchema,
} from './schemas'

export interface RiskQueryOptions {
  asOf?: string
  signal?: AbortSignal
}

function riskParams(options?: RiskQueryOptions) {
  return options?.asOf ? { asOf: options.asOf } : undefined
}

export async function getVaR(portfolioId: string, options?: RiskQueryOptions) {
  const { data } = await apiClient.get(`/risk/${portfolioId}/var`, { params: riskParams(options), signal: options?.signal })
  return parseArray(VaRResultSchema, data)
}

export async function getExposures(portfolioId: string, options?: RiskQueryOptions) {
  const { data } = await apiClient.get(`/risk/${portfolioId}/exposures`, { params: riskParams(options), signal: options?.signal })
  return parseArray(ExposureBucketSchema, data)
}

export async function getAuM(portfolioId: string, options?: RiskQueryOptions) {
  const { data } = await apiClient.get(`/risk/${portfolioId}/aum`, { params: riskParams(options), signal: options?.signal })
  return parseArray(AuMSnapshotSchema, data)
}

export async function getTrackingError(portfolioId: string, options?: RiskQueryOptions) {
  const { data } = await apiClient.get(`/risk/${portfolioId}/tracking-error`, { params: riskParams(options), signal: options?.signal })
  return parseArray(TrackingErrorResultSchema, data)
}

export async function getPnL(portfolioId: string, options?: RiskQueryOptions) {
  const { data } = await apiClient.get(`/risk/${portfolioId}/pnl`, { params: riskParams(options), signal: options?.signal })
  return parseArray(PnLResultSchema, data)
}

export async function getLiquidity(portfolioId: string, options?: RiskQueryOptions) {
  const { data } = await apiClient.get(`/risk/${portfolioId}/liquidity`, { params: riskParams(options), signal: options?.signal })
  return parseArray(LiquidityBucketSchema, data)
}
