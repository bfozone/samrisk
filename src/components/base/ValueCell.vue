<script setup lang="ts">
import { computed } from 'vue'
import { uiDefaults } from '@/ui/config'

const props = withDefaults(defineProps<{
  value: number
  format?: 'percent' | 'currency' | 'number'
  decimals?: number
  sign?: boolean
  currency?: string
  colored?: boolean
  alwaysNegative?: boolean
}>(), {
  format: 'number',
  colored: true,
  alwaysNegative: false,
})

const resolvedDecimals = computed(() => {
  if (props.decimals !== undefined)
    return props.decimals
  if (props.format === 'percent')
    return 1
  if (props.format === 'currency')
    return 0
  return 2
})

const showSign = computed(() => {
  if (props.sign !== undefined)
    return props.sign
  return props.format === 'percent'
})

const formatted = computed(() => {
  const v = props.value
  const d = resolvedDecimals.value

  if (props.format === 'percent') {
    const prefix = showSign.value && v >= 0 ? '+' : ''
    return `${prefix}${v.toFixed(d)}%`
  }

  if (props.format === 'currency') {
    const code = props.currency ?? uiDefaults.valueCell.currencyCode
    const locale = uiDefaults.valueCell.locale
    return `${code} ${v.toLocaleString(locale, { minimumFractionDigits: d, maximumFractionDigits: d })}`
  }

  const prefix = showSign.value && v >= 0 ? '+' : ''
  return `${prefix}${v.toFixed(d)}`
})

const colorStyle = computed(() => {
  if (!props.colored)
    return undefined
  if (props.alwaysNegative)
    return 'var(--app-color-value-negative)'
  return props.value >= 0 ? 'var(--app-color-value-positive)' : 'var(--app-color-value-negative)'
})
</script>

<template>
  <span class="value-cell" :style="{ color: colorStyle }">{{ formatted }}</span>
</template>

<style scoped>
.value-cell {
  font-variant-numeric: tabular-nums;
}
</style>
