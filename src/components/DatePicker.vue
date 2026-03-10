<script setup lang="ts">
import { CalendarDays, ChevronDown } from 'lucide-vue-next'
import { computed, ref } from 'vue'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { useDatePresets } from '@/composables/useDatePresets'
import { useAnalyticsContext } from '@/stores/analytics'

const analytics = useAnalyticsContext()
const presets = useDatePresets()
const open = ref(false)
const activePreset = ref<string | null>(null)

const displayLabel = computed(() => {
  if (activePreset.value) {
    const match = presets.find(p => p.key === activePreset.value)
    if (match)
      return match.label
  }
  if (analytics.asOfDate)
    return formatDisplay(analytics.asOfDate)
  return 'Latest'
})

function formatDisplay(iso: string): string {
  const [y, m, d] = iso.split('-')
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
  return `${months[Number(m) - 1]} ${Number(d)}, ${y}`
}

function selectPreset(key: string, getDate: () => string) {
  activePreset.value = key
  analytics.selectDate(getDate())
  open.value = false
}

function onCustomDate(e: Event) {
  const value = (e.target as HTMLInputElement).value
  activePreset.value = null
  analytics.selectDate(value || null)
  open.value = false
}

function reset() {
  activePreset.value = null
  analytics.selectDate(null)
  open.value = false
}
</script>

<template>
  <Popover v-model:open="open">
    <PopoverTrigger
      class="inline-flex items-center gap-2 whitespace-nowrap rounded-md border border-input bg-card px-3 py-2 text-sm text-foreground outline-none transition-colors hover:border-border-strong focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/50"
    >
      <CalendarDays class="size-3.5 shrink-0 text-muted-foreground" />
      <span>{{ displayLabel }}</span>
      <ChevronDown class="size-3.5 shrink-0 text-muted-foreground" />
    </PopoverTrigger>
    <PopoverContent align="end" class="w-48 p-1">
      <button
        type="button"
        class="flex w-full items-center rounded-sm px-3 py-1.5 text-sm outline-none hover:bg-accent"
        :class="{ 'font-semibold': !analytics.asOfDate }"
        @click="reset"
      >
        Latest
      </button>
      <div class="my-1 border-t border-border"></div>
      <button
        v-for="preset in presets"
        :key="preset.key"
        type="button"
        class="flex w-full items-center rounded-sm px-3 py-1.5 text-sm outline-none hover:bg-accent"
        :class="{ 'font-semibold': activePreset === preset.key }"
        @click="selectPreset(preset.key, preset.getDate)"
      >
        {{ preset.label }}
      </button>
      <div class="my-1 border-t border-border"></div>
      <label class="flex flex-col gap-1 px-3 py-1.5">
        <span class="text-xs text-muted-foreground">Custom date</span>
        <input
          type="date"
          :value="analytics.asOfDate ?? ''"
          class="w-full rounded-sm border border-input bg-card px-2 py-1 text-sm outline-none focus-visible:border-ring"
          @change="onCustomDate"
        />
      </label>
    </PopoverContent>
  </Popover>
</template>
