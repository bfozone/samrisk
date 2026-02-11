import type { EChartsOption } from 'echarts'

function isPlainObject(val: unknown): val is Record<string, unknown> {
  return typeof val === 'object' && val !== null && !Array.isArray(val)
}

export function deepMerge(base: EChartsOption, overrides: EChartsOption): EChartsOption {
  const result: Record<string, unknown> = { ...base }
  for (const key of Object.keys(overrides)) {
    const baseVal = (base as Record<string, unknown>)[key]
    const overVal = (overrides as Record<string, unknown>)[key]
    if (isPlainObject(baseVal) && isPlainObject(overVal)) {
      result[key] = deepMerge(baseVal as EChartsOption, overVal as EChartsOption)
    } else {
      result[key] = overVal
    }
  }
  return result as EChartsOption
}
