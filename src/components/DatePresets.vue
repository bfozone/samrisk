<script setup lang="ts">
import { ref, watch } from 'vue'
import { useDatePresets } from '@/composables/useDatePresets'
import { useAnalyticsContext } from '@/stores/analytics'

const analytics = useAnalyticsContext()
const presets = useDatePresets()
const activeKey = ref<string | null>(null)

watch(() => analytics.asOfDate, (date) => {
  if (!date) {
    activeKey.value = null
    return
  }
  const match = presets.find(p => p.getDate() === date)
  activeKey.value = match?.key ?? null
})

function toggle(key: string, getDate: () => string) {
  if (activeKey.value === key) {
    activeKey.value = null
    analytics.selectDate(null)
  }
  else {
    activeKey.value = key
    analytics.selectDate(getDate())
  }
}
</script>

<template>
  <div role="group" aria-label="Date presets" class="flex flex-wrap gap-1">
    <button
      v-for="preset in presets"
      :key="preset.key"
      type="button"
      :aria-pressed="activeKey === preset.key"
      class="rounded-full px-2.5 py-1 text-xs font-medium transition-colors"
      :class="activeKey === preset.key
        ? 'bg-primary text-primary-foreground'
        : 'bg-muted text-muted-foreground hover:bg-accent hover:text-accent-foreground'"
      @click="toggle(preset.key, preset.getDate)"
    >
      {{ preset.label }}
    </button>
  </div>
</template>
