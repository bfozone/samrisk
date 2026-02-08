import { useQuery } from '@tanstack/vue-query'
import { getVaR, getExposures } from '@/api/risk'
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
