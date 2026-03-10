<script setup lang="ts">
import { computed } from 'vue'
import { Skeleton } from '@/components/ui/skeleton'
import { chartColors } from '@/theme/colors'

const props = defineProps<{
  data: { name: string, percentage: number }[]
  loading?: boolean
}>()

const segments = computed(() =>
  props.data.map((d, i) => ({
    ...d,
    color: chartColors.series[i % chartColors.series.length],
  })),
)
</script>

<template>
  <div class="flex flex-col gap-2">
    <Skeleton v-if="loading" class="h-3 w-full rounded-full" />
    <template v-else>
      <div class="flex h-3 w-full overflow-hidden rounded-full">
        <div
          v-for="seg in segments"
          :key="seg.name"
          :style="{ width: `${Math.abs(seg.percentage)}%`, backgroundColor: seg.color }"
          class="transition-all duration-300"
        ></div>
      </div>
      <div class="flex flex-wrap gap-x-3 gap-y-0.5">
        <span
          v-for="seg in segments"
          :key="seg.name"
          class="inline-flex items-center gap-1 text-[10px] text-muted-foreground"
        >
          <span class="inline-block size-2 rounded-full" :style="{ backgroundColor: seg.color }"></span>
          {{ seg.name }} {{ Math.abs(seg.percentage) }}%
        </span>
      </div>
    </template>
  </div>
</template>
