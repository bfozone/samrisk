<script setup lang="ts">
import { computed, useAttrs } from 'vue'
import DataTable from 'primevue/datatable'
import { uiComponentDefaults } from '@/ui/config'

defineOptions({ inheritAttrs: false })

type DataTableSize = 'small' | 'large'

const props = defineProps<{
  size?: DataTableSize
  stripedRows?: boolean
}>()

const emit = defineEmits([
  'update:selection',
  'update:filters',
  'update:expandedRows',
  'update:editingRows',
  'row-contextmenu',
  'row-edit-save',
])

const attrs = useAttrs()

const resolvedSize = computed(() => props.size ?? uiComponentDefaults.table.size)
const resolvedStripedRows = computed(() => props.stripedRows ?? uiComponentDefaults.table.stripedRows)
</script>

<template>
  <DataTable
    v-bind="attrs"
    :size="resolvedSize"
    :striped-rows="resolvedStripedRows"
    class="app-data-table"
    @update:selection="emit('update:selection', $event)"
    @update:filters="emit('update:filters', $event)"
    @update:expandedRows="emit('update:expandedRows', $event)"
    @update:editingRows="emit('update:editingRows', $event)"
    @row-contextmenu="emit('row-contextmenu', $event)"
    @row-edit-save="emit('row-edit-save', $event)"
  >
    <template
      v-for="(_, slotName) in $slots"
      :key="String(slotName)"
      #[slotName]="slotProps"
    >
      <slot :name="slotName" v-bind="slotProps ?? {}" />
    </template>
  </DataTable>
</template>
