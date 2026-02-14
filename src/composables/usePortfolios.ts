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

function usePortfolioQuery<T>(key: string, fetcher: (id: string) => Promise<T>) {
  return (portfolioId: MaybeRefOrGetter<string>) =>
    useQuery({
      queryKey: [key, portfolioId],
      queryFn: () => fetcher(toValue(portfolioId)),
      enabled: () => !!toValue(portfolioId),
    })
}

export const usePositions = usePortfolioQuery('positions', getPositions)
