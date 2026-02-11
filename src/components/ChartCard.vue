<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue'
import Card from 'primevue/card'
import Skeleton from 'primevue/skeleton'
import VChart from 'vue-echarts'
import type { EChartsOption } from 'echarts'

defineProps<{
  title: string
  option: EChartsOption
  height?: string
  loading?: boolean
}>()

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
    <Card>
      <template #title>{{ title }}</template>
      <template #content>
        <Skeleton v-if="loading || !visible" :style="{ height: height || '350px', width: '100%' }" />
        <VChart v-else :option="option" :style="{ height: height || '350px', width: '100%' }" autoresize />
      </template>
    </Card>
  </div>
</template>
