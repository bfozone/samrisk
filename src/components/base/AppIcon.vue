<script setup lang="ts">
import { computed } from 'vue'
import { iconRegistry } from '@/lib/icons'

const props = withDefaults(defineProps<{
  name: string
  size?: number
}>(), {
  size: 18,
})

const icon = computed(() => iconRegistry[props.name])
</script>

<template>
  <component :is="icon" v-if="icon" :size="size" />
</template>
