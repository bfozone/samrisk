<script setup lang="ts" generic="T extends Record<string, unknown>">
import type { ColumnDef, ColumnFiltersState, SortingState, VisibilityState } from '@tanstack/vue-table'
import type { CsvColumn } from '@/utils/exportCsv'
import {
  FlexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  useVueTable,
} from '@tanstack/vue-table'
import { ArrowDown, ArrowUp, ArrowUpDown, Columns3, Download } from 'lucide-vue-next'
import { computed, ref } from 'vue'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Table,
  TableBody,
  TableCell,
  TableEmpty,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { exportCsv } from '@/utils/exportCsv'

const props = withDefaults(defineProps<{
  data: T[]
  columns: ColumnDef<T, unknown>[]
  striped?: boolean
  stickyHeader?: boolean
  filterable?: boolean
  exportFilename?: string
  exportColumns?: CsvColumn<T>[]
}>(), {
  striped: true,
  stickyHeader: true,
  filterable: false,
})

const sorting = ref<SortingState>([])
const columnFilters = ref<ColumnFiltersState>([])
const columnVisibility = ref<VisibilityState>({})

const table = useVueTable({
  get data() { return props.data },
  get columns() { return props.columns },
  state: {
    get sorting() { return sorting.value },
    get columnFilters() { return columnFilters.value },
    get columnVisibility() { return columnVisibility.value },
  },
  onSortingChange: (updater) => {
    sorting.value = typeof updater === 'function' ? updater(sorting.value) : updater
  },
  onColumnFiltersChange: (updater) => {
    columnFilters.value = typeof updater === 'function' ? updater(columnFilters.value) : updater
  },
  onColumnVisibilityChange: (updater) => {
    columnVisibility.value = typeof updater === 'function' ? updater(columnVisibility.value) : updater
  },
  getCoreRowModel: getCoreRowModel(),
  getSortedRowModel: getSortedRowModel(),
  getFilteredRowModel: getFilteredRowModel(),
})

const hasToolbar = computed(() => props.exportFilename || props.exportColumns)

const rowCountLabel = computed(() => {
  const filtered = table.getFilteredRowModel().rows.length
  const total = props.data.length
  if (filtered === total)
    return `${total} rows`
  return `${filtered} of ${total} rows`
})

function handleExport() {
  if (!props.exportColumns || !props.exportFilename)
    return
  const rows = table.getFilteredRowModel().rows.map(r => r.original)
  exportCsv(props.exportFilename, props.exportColumns, rows)
}
</script>

<template>
  <div>
    <div v-if="hasToolbar" class="flex items-center justify-between gap-2 pb-2">
      <span class="text-xs text-muted-foreground">{{ rowCountLabel }}</span>
      <div class="flex items-center gap-1">
        <DropdownMenu>
          <DropdownMenuTrigger as-child>
            <Button variant="outline" size="sm" class="h-7 text-xs gap-1">
              <Columns3 class="size-3.5" />
              Columns
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuCheckboxItem
              v-for="col in table.getAllLeafColumns().filter(c => c.getCanHide())"
              :key="col.id"
              :checked="col.getIsVisible()"
              @update:checked="col.toggleVisibility($event)"
            >
              {{ typeof col.columnDef.header === 'string' ? col.columnDef.header : col.id }}
            </DropdownMenuCheckboxItem>
          </DropdownMenuContent>
        </DropdownMenu>
        <Button
          v-if="exportFilename && exportColumns"
          variant="outline"
          size="sm"
          class="h-7 text-xs gap-1"
          @click="handleExport"
        >
          <Download class="size-3.5" />
          Export
        </Button>
      </div>
    </div>
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
          <TableRow v-if="filterable">
            <TableHead v-for="header in table.getFlatHeaders()" :key="`filter-${header.id}`" class="py-1 px-2">
              <input
                v-if="header.column.getCanFilter()"
                type="text"
                placeholder="Filter..."
                :value="(header.column.getFilterValue() as string) ?? ''"
                class="h-7 w-full rounded border border-input bg-transparent px-2 text-xs outline-none focus-visible:ring-1 focus-visible:ring-ring"
                @input="header.column.setFilterValue(($event.target as HTMLInputElement).value || undefined)"
              />
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
  </div>
</template>
