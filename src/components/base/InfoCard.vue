<script setup lang="ts">
import AppIcon from '@/components/base/AppIcon.vue'
import { Card, CardContent } from '@/components/ui/card'

defineProps<{
  severity: 'error' | 'warn' | 'success' | 'info'
  title?: string
}>()

const icons: Record<string, string> = {
  error: 'times-circle',
  warn: 'exclamation-triangle',
  success: 'check-circle',
  info: 'info-circle',
}

const borderColors: Record<string, string> = {
  error: 'border-l-negative',
  warn: 'border-l-warning',
  success: 'border-l-positive',
  info: 'border-l-info',
}

const textColors: Record<string, string> = {
  error: 'text-negative',
  warn: 'text-warning',
  success: 'text-positive',
  info: 'text-info',
}
</script>

<template>
  <Card class="gap-0 border-l-3 py-0 transition-shadow duration-200 hover:shadow-md" :class="borderColors[severity]">
    <CardContent class="p-4">
      <div class="flex items-center gap-2" :class="textColors[severity]">
        <AppIcon :name="icons[severity]!" :size="18" class="shrink-0" />
        <span v-if="title" class="text-sm font-semibold">{{ title }}</span>
      </div>
      <div v-if="$slots.default" class="mt-1.5 pl-[1.625rem] text-[0.8125rem] leading-normal text-text-secondary">
        <slot></slot>
      </div>
    </CardContent>
  </Card>
</template>
