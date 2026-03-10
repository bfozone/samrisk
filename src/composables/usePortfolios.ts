import type { MaybeRefOrGetter } from 'vue'
import type { PortfolioQueryOptions } from '@/api/portfolio'
import { useQuery } from '@tanstack/vue-query'
import { toValue } from 'vue'
import { getPortfolios, getPositions } from '@/api/portfolio'

export function usePortfolios() {
  return useQuery({
    queryKey: ['portfolios'],
    queryFn: ({ signal }) => getPortfolios({ signal }),
    retry: 2,
    retryDelay: attemptIndex => Math.min(1000 * 2 ** attemptIndex, 10000),
  })
}

function usePortfolioQuery<T>(
  key: string,
  fetcher: (id: string, options?: PortfolioQueryOptions) => Promise<T>,
) {
  return (portfolioId: MaybeRefOrGetter<string>) =>
    useQuery({
      queryKey: [key, portfolioId],
      queryFn: ({ signal }) => fetcher(toValue(portfolioId), { signal }),
      enabled: () => !!toValue(portfolioId),
    })
}

export const usePositions = usePortfolioQuery('positions', getPositions)
