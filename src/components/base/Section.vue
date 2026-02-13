<script setup lang="ts">
withDefaults(defineProps<{
  spacing?: 'sm' | 'md' | 'lg' | 'xl'
}>(), {
  spacing: 'lg',
})
</script>

<template>
  <div :style="{ marginTop: `var(--app-space-${spacing})` }">
    <slot></slot>
  </div>
</template>
