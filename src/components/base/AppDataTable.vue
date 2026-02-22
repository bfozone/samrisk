<script setup lang="ts" generic="T extends Record<string, unknown>">
import type { ColumnDef, SortingState } from '@tanstack/vue-table'
import {
  FlexRender,
  getCoreRowModel,
  getSortedRowModel,
  useVueTable,
} from '@tanstack/vue-table'
import { ArrowDown, ArrowUp, ArrowUpDown } from 'lucide-vue-next'
import { ref } from 'vue'
import {
  Table,
  TableBody,
  TableCell,
  TableEmpty,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

const props = withDefaults(defineProps<{
  data: T[]
  columns: ColumnDef<T, unknown>[]
  striped?: boolean
  stickyHeader?: boolean
}>(), {
  striped: true,
  stickyHeader: true,
})

const sorting = ref<SortingState>([])

const table = useVueTable({
  get data() { return props.data },
  get columns() { return props.columns },
  state: {
    get sorting() { return sorting.value },
  },
  onSortingChange: (updater) => {
    sorting.value = typeof updater === 'function' ? updater(sorting.value) : updater
  },
  getCoreRowModel: getCoreRowModel(),
  getSortedRowModel: getSortedRowModel(),
})
</script>

<template>
  <div class="overflow-x-auto rounded-lg border border-border">
    <Table>
      <TableHeader :class="stickyHeader && 'sticky top-0 z-[1]'">
        <TableRow v-for="headerGroup in table.getHeaderGroups()" :key="headerGroup.id">
          <TableHead
            v-for="header in headerGroup.headers"
            :key="header.id"
            :class="header.column.getCanSort() && 'cursor-pointer select-none hover:text-foreground'"
            @click="header.column.getToggleSortingHandler()?.($event)"
          >
            <div class="flex items-center gap-1">
              <FlexRender :render="header.column.columnDef.header" :props="header.getContext()" />
              <template v-if="header.column.getCanSort()">
                <ArrowUp v-if="header.column.getIsSorted() === 'asc'" class="size-3" />
                <ArrowDown v-else-if="header.column.getIsSorted() === 'desc'" class="size-3" />
                <ArrowUpDown v-else class="size-3 opacity-40" />
              </template>
            </div>
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow
          v-for="row in table.getRowModel().rows"
          :key="row.id"
          :class="striped && 'even:bg-muted/50'"
        >
          <TableCell v-for="cell in row.getVisibleCells()" :key="cell.id">
            <FlexRender :render="cell.column.columnDef.cell" :props="cell.getContext()" />
          </TableCell>
        </TableRow>
        <TableEmpty v-if="table.getRowModel().rows.length === 0" :colspan="table.getAllColumns().length">
          No data available
        </TableEmpty>
      </TableBody>
    </Table>
  </div>
</template>
