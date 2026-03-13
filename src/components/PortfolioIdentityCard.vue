<script setup lang="ts">
import { computed } from 'vue'
import { formatValue } from '@/charts'
import { Card, CardContent } from '@/components/ui/card'

const props = defineProps<{
  name: string
  manager: string
  benchmarkName: string
  currency: string
  navTotal: number
  asOfDate?: string | null
}>()

const formattedNav = computed(() => formatValue(props.navTotal, 'currency', props.currency))

const asOfLabel = computed(() => {
  if (!props.asOfDate)
    return null
  const d = new Date(`${props.asOfDate}T00:00:00`)
  return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
})
</script>

<template>
  <Card class="py-4">
    <CardContent class="flex flex-wrap items-baseline gap-x-6 gap-y-1">
      <span class="text-base font-semibold text-foreground">{{ name }}</span>
      <span class="text-sm text-muted-foreground">Portfolio Manager: {{ manager }}</span>
      <span class="text-sm font-medium text-foreground">{{ formattedNav }}</span>
      <span class="text-xs text-muted-foreground">Benchmark: {{ benchmarkName }}</span>

      <span v-if="asOfLabel" class="text-xs text-muted-foreground">as of {{ asOfLabel }}</span>
    </CardContent>
  </Card>
</template>
