<script setup lang="ts">
import { AlertCircle } from 'lucide-vue-next'
import { computed } from 'vue'
import { iconRegistry } from '@/lib/icons'

const props = withDefaults(defineProps<{
  name: string
  size?: number
}>(), {
  size: 18,
})

const icon = computed(() => {
  const resolved = iconRegistry[props.name]
  if (!resolved && import.meta.env.DEV) {
    console.warn(`[AppIcon] Unknown icon name: "${props.name}"`)
  }
  return resolved
})
</script>

<template>
  <component :is="icon" v-if="icon" :size="size" aria-hidden="true" />
  <AlertCircle v-else :size="size" class="text-destructive" aria-hidden="true" />
</template>
