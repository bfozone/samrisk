import type { MaybeRefOrGetter } from 'vue'
import type { RiskQueryOptions } from '@/api/risk'
import { useQuery } from '@tanstack/vue-query'
import { toValue } from 'vue'
import { getAuM, getExposures, getLiquidity, getPnL, getTrackingError, getVaR } from '@/api/risk'
import { useAnalyticsContext } from '@/stores/analytics'

function usePortfolioQuery<T>(key: string, fetcher: (id: string, options?: RiskQueryOptions) => Promise<T>) {
  return (portfolioId: MaybeRefOrGetter<string>) => {
    const analytics = useAnalyticsContext()
    return useQuery({
      queryKey: [key, portfolioId, () => analytics.asOfDate],
      queryFn: ({ signal }) => fetcher(toValue(portfolioId), {
        asOf: analytics.asOfDate ?? undefined,
        signal,
      }),
      enabled: () => !!toValue(portfolioId),
    })
  }
}

export const useVaR = usePortfolioQuery('var', getVaR)
export const useExposures = usePortfolioQuery('exposures', getExposures)
export const useAuM = usePortfolioQuery('aum', getAuM)
export const useTrackingError = usePortfolioQuery('tracking-error', getTrackingError)
export const usePnL = usePortfolioQuery('pnl', getPnL)
export const useLiquidity = usePortfolioQuery('liquidity', getLiquidity)
