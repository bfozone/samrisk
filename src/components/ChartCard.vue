<script setup lang="ts">
import type { EChartsOption } from 'echarts'
import Skeleton from 'primevue/skeleton'
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import VChart from 'vue-echarts'
import AppCard from '@/components/base/AppCard.vue'
import QueryError from '@/components/base/QueryError.vue'

const props = defineProps<{
  title: string
  option: EChartsOption
  height?: string
  size?: 'sm' | 'default' | 'lg'
  loading?: boolean
  error?: boolean
  onRetry?: () => void
}>()

const SIZE_MAP = { sm: '220px', default: '350px', lg: '480px' } as const

const resolvedHeight = computed(() => props.height ?? SIZE_MAP[props.size ?? 'default'])

const wrapperRef = ref<HTMLElement>()
const visible = ref(false)
let observer: IntersectionObserver | null = null

onMounted(() => {
  observer = new IntersectionObserver(
    (entries) => {
      if (entries[0]?.isIntersecting) {
        visible.value = true
        observer?.disconnect()
      }
    },
    { rootMargin: '200px' },
  )
  if (wrapperRef.value)
    observer.observe(wrapperRef.value)
})

onBeforeUnmount(() => {
  observer?.disconnect()
})
</script>

<template>
  <div ref="wrapperRef">
    <AppCard>
      <template #title>
        {{ title }}
      </template>
      <template #content>
        <Skeleton v-if="loading || !visible" :style="{ height: resolvedHeight, width: '100%' }" />
        <QueryError v-else-if="error" :on-retry="onRetry" :style="{ height: resolvedHeight }" />
        <VChart v-else :option="option" :style="{ height: resolvedHeight, width: '100%' }" autoresize role="img" :aria-label="`Chart: ${title}`" />
      </template>
    </AppCard>
  </div>
</template>
