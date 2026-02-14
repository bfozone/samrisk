import { useQuery } from '@tanstack/vue-query'
import { getVaR, getExposures, getAuM, getTrackingError, getPnL, getLiquidity } from '@/api/risk'
import type { MaybeRefOrGetter } from 'vue'
import { toValue } from 'vue'

function usePortfolioQuery<T>(key: string, fetcher: (id: string) => Promise<T>) {
  return (portfolioId: MaybeRefOrGetter<string>) =>
    useQuery({
      queryKey: [key, portfolioId],
      queryFn: () => fetcher(toValue(portfolioId)),
      enabled: () => !!toValue(portfolioId),
    })
}

export const useVaR = usePortfolioQuery('var', getVaR)
export const useExposures = usePortfolioQuery('exposures', getExposures)
export const useAuM = usePortfolioQuery('aum', getAuM)
export const useTrackingError = usePortfolioQuery('tracking-error', getTrackingError)
export const usePnL = usePortfolioQuery('pnl', getPnL)
export const useLiquidity = usePortfolioQuery('liquidity', getLiquidity)
