<script setup lang="ts">
import DataTable from 'primevue/datatable'
import { computed, useAttrs } from 'vue'
import { uiComponentDefaults } from '@/ui/config'

defineOptions({ inheritAttrs: false })

const props = defineProps<{
  size?: DataTableSize
  stripedRows?: boolean
}>()

const emit = defineEmits([
  'update:selection',
  'update:filters',
  'update:expandedRows',
  'update:editingRows',
  'rowContextmenu',
  'rowEditSave',
])

type DataTableSize = 'small' | 'large'

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
    @row-contextmenu="emit('rowContextmenu', $event)"
    @row-edit-save="emit('rowEditSave', $event)"
  >
    <template
      v-for="(_, slotName) in $slots"
      :key="String(slotName)"
      #[slotName]="slotProps"
    >
      <slot :name="slotName" v-bind="slotProps ?? {}"></slot>
    </template>
  </DataTable>
</template>
