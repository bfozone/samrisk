<script setup lang="ts">
import { ChevronDown } from 'lucide-vue-next'
import {
  SelectContent,
  SelectItem,
  SelectItemText,
  SelectPortal,
  SelectRoot,
  SelectTrigger,
  SelectValue,
  SelectViewport,
} from 'reka-ui'
import { computed } from 'vue'

const props = defineProps<{
  modelValue: string | null | undefined
  options: Record<string, unknown>[]
  optionLabel?: string
  optionValue?: string
  placeholder?: string
}>()

const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()

const labelKey = computed(() => props.optionLabel ?? 'label')
const valueKey = computed(() => props.optionValue ?? 'value')

function getLabel(option: Record<string, unknown>) {
  return String(option[labelKey.value] ?? '')
}

function getValue(option: Record<string, unknown>) {
  return String(option[valueKey.value] ?? '')
}
</script>

<template>
  <SelectRoot
    :model-value="modelValue ?? undefined"
    @update:model-value="emit('update:modelValue', $event)"
  >
    <SelectTrigger
      class="inline-flex w-full items-center justify-between gap-2 rounded-md border border-input bg-card px-3 py-2 text-sm text-foreground outline-none transition-colors hover:border-border-strong focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/50 data-[placeholder]:text-muted-foreground"
      aria-label="Select option"
    >
      <SelectValue :placeholder="placeholder ?? 'Select...'" />
      <ChevronDown class="size-3.5 shrink-0 text-muted-foreground" />
    </SelectTrigger>

    <SelectPortal>
      <SelectContent
        class="z-50 min-w-[var(--reka-select-trigger-width)] overflow-y-auto rounded-lg border border-border bg-popover p-1 shadow-lg"
        position="popper"
        :side-offset="4"
      >
        <SelectViewport>
          <SelectItem
            v-for="option in options"
            :key="getValue(option)"
            :value="getValue(option)"
            class="flex cursor-pointer select-none items-center rounded-sm px-3 py-2 text-sm text-foreground outline-none hover:bg-accent data-[highlighted]:bg-accent data-[state=checked]:font-semibold"
          >
            <SelectItemText>{{ getLabel(option) }}</SelectItemText>
          </SelectItem>
        </SelectViewport>
      </SelectContent>
    </SelectPortal>
  </SelectRoot>
</template>
