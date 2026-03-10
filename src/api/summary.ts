import apiClient, { parse } from './client'
import { SummaryResponseSchema } from './schemas'

export interface SummaryQueryOptions {
  asOf?: string
  signal?: AbortSignal
}

export async function getSummary(portfolioId: string, options?: SummaryQueryOptions) {
  const searchParams = options?.asOf ? { asOf: options.asOf } : undefined
  const data = await apiClient.get(`risk/${portfolioId}/summary`, { searchParams, signal: options?.signal }).json()
  return parse(SummaryResponseSchema, data)
}
