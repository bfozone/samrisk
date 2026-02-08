import apiClient from './client'
import type { VaRResult, ExposureBucket, TrackingErrorResult, PnLResult, LiquidityBucket, AuMSnapshot } from '@/types'

export async function getVaR(portfolioId: string): Promise<VaRResult[]> {
  const { data } = await apiClient.get<VaRResult[]>(`/risk/${portfolioId}/var`)
  return data
}

export async function getExposures(portfolioId: string): Promise<ExposureBucket[]> {
  const { data } = await apiClient.get<ExposureBucket[]>(`/risk/${portfolioId}/exposures`)
  return data
}

export async function getAuM(portfolioId: string): Promise<AuMSnapshot[]> {
  const { data } = await apiClient.get<AuMSnapshot[]>(`/risk/${portfolioId}/aum`)
  return data
}

export async function getTrackingError(portfolioId: string): Promise<TrackingErrorResult[]> {
  const { data } = await apiClient.get<TrackingErrorResult[]>(`/risk/${portfolioId}/tracking-error`)
  return data
}

export async function getPnL(portfolioId: string): Promise<PnLResult[]> {
  const { data } = await apiClient.get<PnLResult[]>(`/risk/${portfolioId}/pnl`)
  return data
}

export async function getLiquidity(portfolioId: string): Promise<LiquidityBucket[]> {
  const { data } = await apiClient.get<LiquidityBucket[]>(`/risk/${portfolioId}/liquidity`)
  return data
}
