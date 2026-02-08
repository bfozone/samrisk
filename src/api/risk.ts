import apiClient from './client'
import type { VaRResult, ExposureBucket } from '@/types'

export async function getVaR(portfolioId: string): Promise<VaRResult[]> {
  const { data } = await apiClient.get<VaRResult[]>(`/risk/${portfolioId}/var`)
  return data
}

export async function getExposures(portfolioId: string): Promise<ExposureBucket[]> {
  const { data } = await apiClient.get<ExposureBucket[]>(`/risk/${portfolioId}/exposures`)
  return data
}
