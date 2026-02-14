import apiClient, { parse } from './client'
import { SummaryResponseSchema } from './schemas'

export interface SummaryQueryOptions {
  asOf?: string
  signal?: AbortSignal
}

export async function getSummary(portfolioId: string, options?: SummaryQueryOptions) {
  const params = options?.asOf ? { asOf: options.asOf } : undefined
  const { data } = await apiClient.get(`/risk/${portfolioId}/summary`, { params, signal: options?.signal })
  return parse(SummaryResponseSchema, data)
}
