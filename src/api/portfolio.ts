import apiClient, { parseArray } from './client'
import { PortfolioSchema, PositionSchema } from './schemas'

export async function getPortfolios() {
  const { data } = await apiClient.get('/portfolios')
  return parseArray(PortfolioSchema, data)
}

export async function getPositions(portfolioId: string) {
  const { data } = await apiClient.get(`/portfolios/${portfolioId}/positions`)
  return parseArray(PositionSchema, data)
}
