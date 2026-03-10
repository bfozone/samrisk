import type { MaybeRefOrGetter } from 'vue'
import { useQuery } from '@tanstack/vue-query'
import { toValue } from 'vue'
import { getSummary } from '@/api/summary'
import { useAnalyticsContext } from '@/stores/analytics'

export function useSummary(portfolioId: MaybeRefOrGetter<string>) {
  const analytics = useAnalyticsContext()
  return useQuery({
    queryKey: ['summary', portfolioId, () => analytics.asOfDate],
    queryFn: ({ signal }) =>
      getSummary(toValue(portfolioId), {
        asOf: analytics.asOfDate ?? undefined,
        signal,
      }),
    enabled: () => !!toValue(portfolioId),
  })
}
