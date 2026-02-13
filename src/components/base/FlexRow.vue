<script setup lang="ts">
withDefaults(defineProps<{
  gap?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
  align?: 'start' | 'center' | 'end' | 'stretch' | 'baseline'
  wrap?: boolean
}>(), {
  gap: 'sm',
  align: 'center',
  wrap: true,
})
</script>

<template>
  <div
    class="flex-row"
    :style="{
      gap: `var(--app-space-${gap})`,
      alignItems: align,
      flexWrap: wrap ? 'wrap' : 'nowrap',
    }"
  >
    <slot></slot>
  </div>
</template>

<style scoped>
.flex-row {
  display: flex;
}
</style>
