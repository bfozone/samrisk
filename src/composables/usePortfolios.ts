import { useQuery } from '@tanstack/vue-query'
import { getPortfolios, getPositions } from '@/api/portfolio'
import type { MaybeRefOrGetter } from 'vue'
import { toValue } from 'vue'

export function usePortfolios() {
  return useQuery({
    queryKey: ['portfolios'],
    queryFn: getPortfolios,
  })
}

export function usePositions(portfolioId: MaybeRefOrGetter<string>) {
  return useQuery({
    queryKey: ['positions', portfolioId],
    queryFn: () => getPositions(toValue(portfolioId)),
    enabled: () => !!toValue(portfolioId),
  })
}
