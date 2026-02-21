<script setup lang="ts">
import { Check, ChevronDown } from 'lucide-vue-next'
import {
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxItemIndicator,
  ComboboxPortal,
  ComboboxRoot,
  ComboboxViewport,
} from 'reka-ui'

defineProps<{
  modelValue?: string
  options: { value: string, label: string }[]
  placeholder?: string
  disabled?: boolean
}>()

defineEmits<{
  'update:modelValue': [value: string]
}>()
</script>

<template>
  <ComboboxRoot
    :model-value="modelValue"
    :disabled="disabled"
    @update:model-value="$emit('update:modelValue', $event as string)"
  >
    <div class="inline-flex w-full items-center gap-2 rounded-md border border-input bg-card transition-colors hover:border-border-strong focus-within:border-ring focus-within:ring-2 focus-within:ring-ring/50">
      <ComboboxInput
        :placeholder="placeholder ?? 'Search...'"
        class="min-h-[2.375rem] flex-1 border-none bg-transparent px-3 py-2 text-sm text-foreground outline-none placeholder:text-muted-foreground"
      />
      <ChevronDown class="mr-3 size-3.5 shrink-0 text-muted-foreground" />
    </div>
    <ComboboxPortal>
      <ComboboxContent
        class="z-50 min-w-[var(--reka-combobox-trigger-width)] max-h-60 overflow-y-auto rounded-lg border border-border bg-popover p-1 shadow-lg animate-in fade-in-0 zoom-in-95"
        position="popper"
        :side-offset="4"
      >
        <ComboboxViewport>
          <ComboboxEmpty class="px-3 py-3 text-center text-sm text-muted-foreground">
            No results found
          </ComboboxEmpty>
          <ComboboxItem
            v-for="option in options"
            :key="option.value"
            :value="option.value"
            class="flex cursor-pointer select-none items-center justify-between rounded-sm px-3 py-2 text-sm text-foreground outline-none hover:bg-accent data-[highlighted]:bg-accent data-[state=checked]:font-semibold"
          >
            <span>{{ option.label }}</span>
            <ComboboxItemIndicator>
              <Check class="size-3.5" />
            </ComboboxItemIndicator>
          </ComboboxItem>
        </ComboboxViewport>
      </ComboboxContent>
    </ComboboxPortal>
  </ComboboxRoot>
</template>
