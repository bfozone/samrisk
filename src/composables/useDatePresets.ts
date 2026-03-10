import { format, startOfMonth, startOfQuarter, startOfYear, subMonths, subYears } from 'date-fns'

export interface DatePreset {
  label: string
  key: string
  getDate: () => string
}

function toIso(date: Date): string {
  return format(date, 'yyyy-MM-dd')
}

export function useDatePresets(): DatePreset[] {
  return [
    { label: 'MTD', key: 'mtd', getDate: () => toIso(startOfMonth(new Date())) },
    { label: 'QTD', key: 'qtd', getDate: () => toIso(startOfQuarter(new Date())) },
    { label: 'YTD', key: 'ytd', getDate: () => toIso(startOfYear(new Date())) },
    { label: '1M', key: '1m', getDate: () => toIso(subMonths(new Date(), 1)) },
    { label: '3M', key: '3m', getDate: () => toIso(subMonths(new Date(), 3)) },
    { label: '6M', key: '6m', getDate: () => toIso(subMonths(new Date(), 6)) },
    { label: '1Y', key: '1y', getDate: () => toIso(subYears(new Date(), 1)) },
  ]
}
