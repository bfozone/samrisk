import { useQuery } from '@tanstack/vue-query'
import { getVaR, getExposures, getAuM, getTrackingError, getPnL, getLiquidity } from '@/api/risk'
import type { MaybeRefOrGetter } from 'vue'
import { toValue } from 'vue'

export function useVaR(portfolioId: MaybeRefOrGetter<string>) {
  return useQuery({
    queryKey: ['var', portfolioId],
    queryFn: () => getVaR(toValue(portfolioId)),
    enabled: () => !!toValue(portfolioId),
  })
}

export function useExposures(portfolioId: MaybeRefOrGetter<string>) {
  return useQuery({
    queryKey: ['exposures', portfolioId],
    queryFn: () => getExposures(toValue(portfolioId)),
    enabled: () => !!toValue(portfolioId),
  })
}

export function useAuM(portfolioId: MaybeRefOrGetter<string>) {
  return useQuery({
    queryKey: ['aum', portfolioId],
    queryFn: () => getAuM(toValue(portfolioId)),
    enabled: () => !!toValue(portfolioId),
  })
}

export function useTrackingError(portfolioId: MaybeRefOrGetter<string>) {
  return useQuery({
    queryKey: ['tracking-error', portfolioId],
    queryFn: () => getTrackingError(toValue(portfolioId)),
    enabled: () => !!toValue(portfolioId),
  })
}

export function usePnL(portfolioId: MaybeRefOrGetter<string>) {
  return useQuery({
    queryKey: ['pnl', portfolioId],
    queryFn: () => getPnL(toValue(portfolioId)),
    enabled: () => !!toValue(portfolioId),
  })
}

export function useLiquidity(portfolioId: MaybeRefOrGetter<string>) {
  return useQuery({
    queryKey: ['liquidity', portfolioId],
    queryFn: () => getLiquidity(toValue(portfolioId)),
    enabled: () => !!toValue(portfolioId),
  })
}
