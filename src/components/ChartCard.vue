<script setup lang="ts">
import { computed, ref, onMounted, onBeforeUnmount } from 'vue'
import Skeleton from 'primevue/skeleton'
import VChart from 'vue-echarts'
import type { EChartsOption } from 'echarts'
import AppCard from '@/components/base/AppCard.vue'

const SIZE_MAP = { sm: '220px', default: '350px', lg: '480px' } as const

const props = defineProps<{
  title: string
  option: EChartsOption
  height?: string
  size?: 'sm' | 'default' | 'lg'
  loading?: boolean
}>()

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
  if (wrapperRef.value) observer.observe(wrapperRef.value)
})

onBeforeUnmount(() => {
  observer?.disconnect()
})
</script>

<template>
  <div ref="wrapperRef">
    <AppCard>
      <template #title>{{ title }}</template>
      <template #content>
        <Skeleton v-if="loading || !visible" :style="{ height: resolvedHeight, width: '100%' }" />
        <VChart v-else :option="option" :style="{ height: resolvedHeight, width: '100%' }" autoresize />
      </template>
    </AppCard>
  </div>
</template>
