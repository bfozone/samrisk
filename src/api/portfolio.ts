import apiClient from './client'
import type { Portfolio, Position } from '@/types'

export async function getPortfolios(): Promise<Portfolio[]> {
  const { data } = await apiClient.get<Portfolio[]>('/portfolios')
  return data
}

export async function getPositions(portfolioId: string): Promise<Position[]> {
  const { data } = await apiClient.get<Position[]>(`/portfolios/${portfolioId}/positions`)
  return data
}
