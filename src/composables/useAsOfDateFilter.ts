import { useAnalyticsContext } from '@/stores/analytics'

export function useAsOfDateFilter() {
  const analytics = useAnalyticsContext()

  function byAsOfDate<T extends { date: string }>(items: T[]): T[] {
    const asOfDate = analytics.asOfDate
    if (!asOfDate) return items
    return items.filter((item) => item.date <= asOfDate)
  }

  return { byAsOfDate }
}
