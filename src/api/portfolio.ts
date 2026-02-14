import apiClient, { parseArray } from './client'
import { PortfolioSchema, PositionSchema } from './schemas'

export interface PortfolioQueryOptions {
  signal?: AbortSignal
}

export async function getPortfolios(options?: PortfolioQueryOptions) {
  const { data } = await apiClient.get('/portfolios', { signal: options?.signal })
  return parseArray(PortfolioSchema, data)
}

export async function getPositions(portfolioId: string, options?: PortfolioQueryOptions) {
  const { data } = await apiClient.get(`/portfolios/${portfolioId}/positions`, { signal: options?.signal })
  return parseArray(PositionSchema, data)
}
