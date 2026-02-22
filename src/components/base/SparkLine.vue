<script setup lang="ts">
import { computed } from 'vue'

const props = withDefaults(defineProps<{
  data: number[]
  color?: string
  width?: number
  height?: number
}>(), {
  color: 'currentColor',
  width: 80,
  height: 32,
})

const points = computed(() => {
  if (props.data.length < 2)
    return ''
  const min = Math.min(...props.data)
  const max = Math.max(...props.data)
  const range = max - min || 1
  const stepX = props.width / (props.data.length - 1)
  return props.data
    .map((v, i) => `${i * stepX},${props.height - ((v - min) / range) * props.height}`)
    .join(' ')
})

const areaPoints = computed(() => {
  if (!points.value)
    return ''
  return `0,${props.height} ${points.value} ${props.width},${props.height}`
})
</script>

<template>
  <svg
    :width="width"
    :height="height"
    :viewBox="`0 0 ${width} ${height}`"
    preserveAspectRatio="none"
    class="block"
  >
    <defs>
      <linearGradient :id="`spark-fill-${$.uid}`" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" :stop-color="color" stop-opacity="0.25" />
        <stop offset="100%" :stop-color="color" stop-opacity="0" />
      </linearGradient>
    </defs>
    <polygon
      v-if="areaPoints"
      :points="areaPoints"
      :fill="`url(#spark-fill-${$.uid})`"
    />
    <polyline
      v-if="points"
      :points="points"
      fill="none"
      :stroke="color"
      stroke-width="1.5"
      stroke-linejoin="round"
      stroke-linecap="round"
    />
  </svg>
</template>
