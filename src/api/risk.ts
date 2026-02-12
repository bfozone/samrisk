import apiClient, { parseArray } from './client'
import {
  VaRResultSchema,
  ExposureBucketSchema,
  AuMSnapshotSchema,
  TrackingErrorResultSchema,
  PnLResultSchema,
  LiquidityBucketSchema,
} from './schemas'

export async function getVaR(portfolioId: string) {
  const { data } = await apiClient.get(`/risk/${portfolioId}/var`)
  return parseArray(VaRResultSchema, data)
}

export async function getExposures(portfolioId: string) {
  const { data } = await apiClient.get(`/risk/${portfolioId}/exposures`)
  return parseArray(ExposureBucketSchema, data)
}

export async function getAuM(portfolioId: string) {
  const { data } = await apiClient.get(`/risk/${portfolioId}/aum`)
  return parseArray(AuMSnapshotSchema, data)
}

export async function getTrackingError(portfolioId: string) {
  const { data } = await apiClient.get(`/risk/${portfolioId}/tracking-error`)
  return parseArray(TrackingErrorResultSchema, data)
}

export async function getPnL(portfolioId: string) {
  const { data } = await apiClient.get(`/risk/${portfolioId}/pnl`)
  return parseArray(PnLResultSchema, data)
}

export async function getLiquidity(portfolioId: string) {
  const { data } = await apiClient.get(`/risk/${portfolioId}/liquidity`)
  return parseArray(LiquidityBucketSchema, data)
}
