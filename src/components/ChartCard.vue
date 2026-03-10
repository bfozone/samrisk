<script setup lang="ts">
import type { EChartsOption } from 'echarts'
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import VChart from 'vue-echarts'
import QueryError from '@/components/base/QueryError.vue'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { useTheme } from '@/composables/useTheme'

const props = defineProps<{
  title: string
  option: EChartsOption
  height?: string
  size?: 'sm' | 'default' | 'lg'
  loading?: boolean
  error?: boolean
  onRetry?: () => void
}>()

const { isDark } = useTheme()

const SIZE_MAP = { sm: '220px', default: '350px', lg: '480px' } as const

const resolvedHeight = computed(() => props.height ?? SIZE_MAP[props.size ?? 'default'])

const chartTheme = computed(() => isDark.value ? 'samrisk-dark' : 'samrisk-light')

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
    <Card class="transition-shadow duration-200 hover:shadow-md">
      <CardHeader>
        <CardTitle>{{ title }}</CardTitle>
      </CardHeader>
      <CardContent>
        <Skeleton v-if="loading || !visible" :style="{ height: resolvedHeight }" class="w-full" />
        <QueryError v-else-if="error" :on-retry="onRetry" :style="{ height: resolvedHeight }" />
        <VChart v-else :option="option" :theme="chartTheme" :style="{ height: resolvedHeight, width: '100%' }" autoresize role="img" :aria-label="`Chart: ${title}`" />
      </CardContent>
    </Card>
  </div>
</template>
