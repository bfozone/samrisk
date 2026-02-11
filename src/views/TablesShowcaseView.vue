<script setup lang="ts">
import { ref, computed } from 'vue'
import { FilterMatchMode } from '@primevue/core/api'

import Card from 'primevue/card'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import ColumnGroup from 'primevue/columngroup'
import Row from 'primevue/row'
import Tag from 'primevue/tag'
import InputText from 'primevue/inputtext'
import InputNumber from 'primevue/inputnumber'
import Select from 'primevue/select'
import TreeTable from 'primevue/treetable'

// ── Helpers ──────────────────────────────────────────

function fmtPct(v: number) {
  return `${v >= 0 ? '+' : ''}${v.toFixed(1)}%`
}

function fmtCurrency(v: number) {
  return `CHF ${v.toLocaleString('de-CH')}`
}

function sideSeverity(side: string) {
  return side === 'Buy' ? 'info' : 'danger'
}

function statusSeverity(status: string) {
  if (status === 'Filled') return 'success'
  if (status === 'Partial') return 'warn'
  return 'secondary'
}

// Seeded random for deterministic sparkline data
function seededRandom(seed: number) {
  let s = seed
  return () => {
    s = (s * 16807 + 0) % 2147483647
    return s / 2147483647
  }
}

function generateSparkline(seed: number, points = 30, base = 100, vol = 5): number[] {
  const rng = seededRandom(seed)
  const data: number[] = [base]
  for (let i = 1; i < points; i++) {
    data.push(+(data[i - 1]! + (rng() - 0.48) * vol).toFixed(1))
  }
  return data
}

function sparklinePath(data: number[], width: number, height: number): string {
  const min = Math.min(...data)
  const max = Math.max(...data)
  const range = max - min || 1
  const stepX = width / (data.length - 1)
  return data.map((v, i) => {
    const x = i * stepX
    const y = height - ((v - min) / range) * height
    return `${i === 0 ? 'M' : 'L'}${x.toFixed(1)},${y.toFixed(1)}`
  }).join(' ')
}

function sparklineColor(data: number[]): string {
  const last = data[data.length - 1] ?? 0
  const first = data[0] ?? 0
  return last >= first ? 'var(--p-green-500)' : 'var(--p-red-500)'
}

// ── Basic table data ─────────────────────────────────

const holdings = [
  { name: 'Apple Inc.', asset: 'Equities', sector: 'Technology', weight: 8.2, returnYtd: 12.4 },
  { name: 'US Treasury 10Y', asset: 'Fixed Income', sector: 'Government', weight: 6.5, returnYtd: 3.1 },
  { name: 'Nestle SA', asset: 'Equities', sector: 'Consumer Staples', weight: 4.8, returnYtd: -1.2 },
  { name: 'iShares Gold Trust', asset: 'Commodities', sector: 'Precious Metals', weight: 3.1, returnYtd: 7.8 },
  { name: 'Microsoft Corp.', asset: 'Equities', sector: 'Technology', weight: 7.4, returnYtd: 18.6 },
  { name: 'Vanguard REIT ETF', asset: 'Real Estate', sector: 'REITs', weight: 2.9, returnYtd: -3.5 },
  { name: 'JPMorgan IG Bond', asset: 'Fixed Income', sector: 'Credit', weight: 5.6, returnYtd: 4.2 },
  { name: 'Novartis AG', asset: 'Equities', sector: 'Healthcare', weight: 3.7, returnYtd: 5.1 },
]

// ── Paginated table data ─────────────────────────────

const trades = Array.from({ length: 42 }, (_, i) => ({
  id: 1000 + i,
  date: `2025-01-${String((i % 28) + 1).padStart(2, '0')}`,
  instrument: ['AAPL', 'MSFT', 'NVDA', 'GOOGL', 'AMZN', 'TSLA', 'JPM', 'GS', 'NESN', 'ROG'][i % 10],
  side: i % 3 === 0 ? 'Sell' : 'Buy',
  quantity: Math.round((Math.random() * 500 + 50) / 10) * 10,
  price: +(Math.random() * 400 + 50).toFixed(2),
  status: ['Filled', 'Filled', 'Filled', 'Partial', 'Pending'][i % 5],
}))

// ── Selection table data ─────────────────────────────

const orders = [
  { id: 'ORD-001', portfolio: 'Growth Fund', instrument: 'AAPL', side: 'Buy', notional: 125_000, status: 'Pending' },
  { id: 'ORD-002', portfolio: 'Income Fund', instrument: 'US10Y', side: 'Buy', notional: 500_000, status: 'Pending' },
  { id: 'ORD-003', portfolio: 'Growth Fund', instrument: 'NVDA', side: 'Sell', notional: 87_500, status: 'Review' },
  { id: 'ORD-004', portfolio: 'Multi-Asset', instrument: 'GLD', side: 'Buy', notional: 200_000, status: 'Pending' },
  { id: 'ORD-005', portfolio: 'Income Fund', instrument: 'IGSB', side: 'Sell', notional: 350_000, status: 'Review' },
  { id: 'ORD-006', portfolio: 'Growth Fund', instrument: 'MSFT', side: 'Buy', notional: 110_000, status: 'Pending' },
]
const selectedOrders = ref<typeof orders>([])

// ── Frozen columns data ──────────────────────────────

const riskMetrics = [
  { name: 'Growth Fund', aum: 162_000, var95: 2.4, var99: 3.8, cvar: 4.1, te: 1.6, beta: 1.12, sharpe: 0.85, sortino: 1.02, maxDd: -8.2, volatility: 14.5 },
  { name: 'Income Fund', aum: 98_000, var95: 0.8, var99: 1.4, cvar: 1.6, te: 0.4, beta: 0.35, sharpe: 1.12, sortino: 1.45, maxDd: -3.1, volatility: 4.2 },
  { name: 'Multi-Asset', aum: 245_000, var95: 1.5, var99: 2.6, cvar: 2.9, te: 0.9, beta: 0.72, sharpe: 0.95, sortino: 1.18, maxDd: -5.8, volatility: 8.7 },
  { name: 'Balanced', aum: 134_000, var95: 1.2, var99: 2.1, cvar: 2.3, te: 0.7, beta: 0.58, sharpe: 1.01, sortino: 1.28, maxDd: -4.5, volatility: 6.9 },
  { name: 'Aggressive', aum: 76_000, var95: 3.1, var99: 5.2, cvar: 5.8, te: 2.1, beta: 1.35, sharpe: 0.72, sortino: 0.88, maxDd: -12.4, volatility: 18.3 },
]

// ── Expandable rows data ─────────────────────────────

const expandedRows = ref({})
const positions = [
  {
    name: 'Equities', weight: 45.2, returnYtd: 11.3,
    children: [
      { name: 'US Large Cap', weight: 22.1, returnYtd: 14.8 },
      { name: 'EU Developed', weight: 12.4, returnYtd: 6.2 },
      { name: 'EM Asia', weight: 7.1, returnYtd: 9.5 },
      { name: 'Japan', weight: 3.6, returnYtd: 4.1 },
    ],
  },
  {
    name: 'Fixed Income', weight: 32.5, returnYtd: 3.8,
    children: [
      { name: 'Govt Bonds', weight: 15.2, returnYtd: 2.9 },
      { name: 'IG Credit', weight: 11.8, returnYtd: 4.5 },
      { name: 'HY Credit', weight: 5.5, returnYtd: 5.2 },
    ],
  },
  {
    name: 'Alternatives', weight: 15.1, returnYtd: 6.7,
    children: [
      { name: 'Hedge Funds', weight: 8.3, returnYtd: 5.9 },
      { name: 'Private Equity', weight: 6.8, returnYtd: 7.8 },
    ],
  },
  {
    name: 'Cash', weight: 7.2, returnYtd: 0.4,
    children: [
      { name: 'Money Market', weight: 5.1, returnYtd: 0.5 },
      { name: 'Short-Term Bills', weight: 2.1, returnYtd: 0.2 },
    ],
  },
]

// ── Grouped headers data ─────────────────────────────

const groupedData = [
  { name: 'Growth Fund', mktVar: 2.1, credVar: 0.3, liqVar: 0.1, totalVar: 2.4, mktStress: -8.5, credStress: -1.2, liqStress: -0.5, totalStress: -10.2 },
  { name: 'Income Fund', mktVar: 0.4, credVar: 0.3, liqVar: 0.1, totalVar: 0.8, mktStress: -2.1, credStress: -2.8, liqStress: -0.3, totalStress: -5.2 },
  { name: 'Multi-Asset', mktVar: 1.0, credVar: 0.3, liqVar: 0.2, totalVar: 1.5, mktStress: -4.8, credStress: -1.5, liqStress: -0.8, totalStress: -7.1 },
  { name: 'Balanced', mktVar: 0.7, credVar: 0.3, liqVar: 0.2, totalVar: 1.2, mktStress: -3.5, credStress: -1.8, liqStress: -0.6, totalStress: -5.9 },
]

// ── Sparklines + Inline Bars data ────────────────────

const sparklineData = [
  { name: 'Growth Fund', aum: 162_000, returnMtd: 2.8, returnYtd: 11.3, weight: 22.5, spark: generateSparkline(101, 30, 105, 3) },
  { name: 'Income Fund', aum: 98_000, returnMtd: 0.5, returnYtd: 3.8, weight: 13.6, spark: generateSparkline(202, 30, 100, 1.5) },
  { name: 'Multi-Asset', aum: 245_000, returnMtd: -0.3, returnYtd: 6.7, weight: 34.1, spark: generateSparkline(303, 30, 98, 2) },
  { name: 'Balanced', aum: 134_000, returnMtd: 1.2, returnYtd: 5.1, weight: 18.6, spark: generateSparkline(404, 30, 102, 2.5) },
  { name: 'Aggressive', aum: 76_000, returnMtd: -1.5, returnYtd: -2.4, weight: 10.6, spark: generateSparkline(505, 30, 110, 5) },
  { name: 'Short Duration', aum: 52_000, returnMtd: 0.2, returnYtd: 1.8, weight: 0.6, spark: generateSparkline(606, 30, 100, 0.5) },
]

const maxWeight = computed(() => Math.max(...sparklineData.map(d => d.weight)))

// ── Heatmap cells data ───────────────────────────────

const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
const heatmapData = [
  { name: 'Growth Fund', returns: [2.1, -0.8, 3.2, 1.5, -1.2, 2.8, 0.4, -2.1, 1.8, 3.5, -0.5, 1.9] },
  { name: 'Income Fund', returns: [0.5, 0.3, -0.2, 0.8, 0.4, 0.1, 0.6, -0.1, 0.3, 0.7, 0.2, 0.4] },
  { name: 'Multi-Asset', returns: [1.2, -0.4, 1.8, 0.9, -0.7, 1.5, 0.2, -1.1, 0.8, 2.1, -0.3, 1.0] },
  { name: 'Balanced', returns: [0.8, -0.1, 1.2, 0.6, -0.3, 1.0, 0.3, -0.6, 0.5, 1.4, 0.1, 0.7] },
  { name: 'Aggressive', returns: [3.5, -2.1, 4.8, 2.2, -3.1, 4.1, 0.8, -3.8, 2.5, 5.2, -1.2, 2.8] },
]

function heatmapBg(v: number): string {
  if (v >= 3) return 'rgba(34, 139, 34, 0.3)'
  if (v >= 1) return 'rgba(34, 139, 34, 0.15)'
  if (v > 0) return 'rgba(34, 139, 34, 0.06)'
  if (v > -1) return 'rgba(238, 0, 12, 0.06)'
  if (v > -3) return 'rgba(238, 0, 12, 0.15)'
  return 'rgba(238, 0, 12, 0.3)'
}

// ── Column filters data ──────────────────────────────

const filterableData = Array.from({ length: 30 }, (_, i) => {
  const instruments = ['AAPL', 'MSFT', 'NVDA', 'GOOGL', 'AMZN', 'TSLA', 'JPM', 'GS', 'NESN', 'ROG']
  const sectors = ['Technology', 'Financials', 'Healthcare', 'Consumer', 'Energy']
  const statuses = ['Active', 'Watchlist', 'Restricted']
  return {
    id: i + 1,
    instrument: instruments[i % instruments.length],
    sector: sectors[i % sectors.length],
    weight: +((Math.abs(Math.sin(i * 1.5)) * 8) + 0.5).toFixed(1),
    pnl: +((Math.sin(i * 2.1) * 50000)).toFixed(0),
    status: statuses[i % statuses.length],
  }
})

const filters = ref({
  global: { value: null, matchMode: FilterMatchMode.CONTAINS },
  instrument: { value: null, matchMode: FilterMatchMode.CONTAINS },
  sector: { value: null, matchMode: FilterMatchMode.EQUALS },
  status: { value: null, matchMode: FilterMatchMode.EQUALS },
})

const sectorOptions = ['Technology', 'Financials', 'Healthcare', 'Consumer', 'Energy']
const statusFilterOptions = ['Active', 'Watchlist', 'Restricted']

// ── TreeTable data ───────────────────────────────────

const treeNodes = ref([
  {
    key: '0',
    data: { name: 'Global Equities', weight: 45.2, returnYtd: 11.3, var95: 2.4 },
    children: [
      {
        key: '0-0',
        data: { name: 'US Large Cap', weight: 22.1, returnYtd: 14.8, var95: 2.8 },
        children: [
          { key: '0-0-0', data: { name: 'Apple Inc.', weight: 8.2, returnYtd: 12.4, var95: 3.1 } },
          { key: '0-0-1', data: { name: 'Microsoft Corp.', weight: 7.4, returnYtd: 18.6, var95: 2.9 } },
          { key: '0-0-2', data: { name: 'NVIDIA Corp.', weight: 6.5, returnYtd: 22.1, var95: 4.2 } },
        ],
      },
      {
        key: '0-1',
        data: { name: 'EU Developed', weight: 12.4, returnYtd: 6.2, var95: 1.8 },
        children: [
          { key: '0-1-0', data: { name: 'Nestle SA', weight: 4.8, returnYtd: -1.2, var95: 1.2 } },
          { key: '0-1-1', data: { name: 'ASML Holding', weight: 4.1, returnYtd: 15.3, var95: 3.5 } },
          { key: '0-1-2', data: { name: 'Novartis AG', weight: 3.5, returnYtd: 5.1, var95: 1.4 } },
        ],
      },
      { key: '0-2', data: { name: 'EM Asia', weight: 7.1, returnYtd: 9.5, var95: 3.2 } },
      { key: '0-3', data: { name: 'Japan', weight: 3.6, returnYtd: 4.1, var95: 1.9 } },
    ],
  },
  {
    key: '1',
    data: { name: 'Fixed Income', weight: 32.5, returnYtd: 3.8, var95: 0.8 },
    children: [
      { key: '1-0', data: { name: 'Govt Bonds', weight: 15.2, returnYtd: 2.9, var95: 0.5 } },
      { key: '1-1', data: { name: 'IG Credit', weight: 11.8, returnYtd: 4.5, var95: 0.9 } },
      { key: '1-2', data: { name: 'HY Credit', weight: 5.5, returnYtd: 5.2, var95: 1.8 } },
    ],
  },
  {
    key: '2',
    data: { name: 'Alternatives', weight: 15.1, returnYtd: 6.7, var95: 1.5 },
    children: [
      { key: '2-0', data: { name: 'Hedge Funds', weight: 8.3, returnYtd: 5.9, var95: 1.2 } },
      { key: '2-1', data: { name: 'Private Equity', weight: 6.8, returnYtd: 7.8, var95: 2.1 } },
    ],
  },
  {
    key: '3',
    data: { name: 'Cash', weight: 7.2, returnYtd: 0.4, var95: 0.0 },
  },
])

// ── Editable cells data ──────────────────────────────

const editableData = ref([
  { name: 'Equities', current: 45.2, target: 44.0, limitMax: 50.0 },
  { name: 'Fixed Income', current: 32.5, target: 34.0, limitMax: 40.0 },
  { name: 'Alternatives', current: 15.1, target: 15.0, limitMax: 20.0 },
  { name: 'Cash', current: 7.2, target: 7.0, limitMax: 15.0 },
])

const editingRows = ref<typeof editableData.value>([])

function onRowEditSave(event: { newData: (typeof editableData.value)[0]; index: number }) {
  editableData.value[event.index] = event.newData
}

const totalTarget = computed(() => editableData.value.reduce((s, r) => s + r.target, 0))
</script>

<template>
  <div class="showcase">
    <!-- Basic + Selection (2-col) -->
    <div class="showcase-grid">
      <Card>
        <template #title>Basic with Sorting</template>
        <template #content>
          <DataTable :value="holdings" striped-rows sort-field="weight" :sort-order="-1" size="small">
            <Column field="name" header="Instrument" sortable />
            <Column field="asset" header="Asset Class" sortable />
            <Column field="sector" header="Sector" sortable />
            <Column field="weight" header="Weight" sortable>
              <template #body="{ data }">{{ data.weight.toFixed(1) }}%</template>
            </Column>
            <Column field="returnYtd" header="YTD Return" sortable>
              <template #body="{ data }">
                <span :style="{ color: data.returnYtd >= 0 ? 'var(--p-green-500)' : 'var(--p-red-500)' }">
                  {{ fmtPct(data.returnYtd) }}
                </span>
              </template>
            </Column>
          </DataTable>
        </template>
      </Card>

      <Card>
        <template #title>Row Selection</template>
        <template #content>
          <DataTable v-model:selection="selectedOrders" :value="orders" data-key="id" size="small">
            <Column selection-mode="multiple" header-style="width: 3rem" />
            <Column field="id" header="Order ID" />
            <Column field="portfolio" header="Portfolio" />
            <Column field="instrument" header="Instrument" />
            <Column field="side" header="Side">
              <template #body="{ data }">
                <Tag :value="data.side" :severity="sideSeverity(data.side)" />
              </template>
            </Column>
            <Column field="notional" header="Notional">
              <template #body="{ data }">{{ fmtCurrency(data.notional) }}</template>
            </Column>
          </DataTable>
        </template>
      </Card>
    </div>

    <!-- Sparklines + Inline Bars (full width) -->
    <Card class="section-gap">
      <template #title>Sparklines + Inline Bars</template>
      <template #content>
        <DataTable :value="sparklineData" striped-rows size="small">
          <Column field="name" header="Portfolio" sortable />
          <Column field="aum" header="AuM" sortable>
            <template #body="{ data }">{{ fmtCurrency(data.aum) }}</template>
          </Column>
          <Column header="30D Trend" style="width: 8rem">
            <template #body="{ data }">
              <svg width="80" height="24" class="sparkline">
                <path :d="sparklinePath(data.spark, 78, 22)" fill="none" :stroke="sparklineColor(data.spark)" stroke-width="1.5" />
              </svg>
            </template>
          </Column>
          <Column field="returnMtd" header="MTD" sortable>
            <template #body="{ data }">
              <span :style="{ color: data.returnMtd >= 0 ? 'var(--p-green-500)' : 'var(--p-red-500)' }">
                {{ fmtPct(data.returnMtd) }}
              </span>
            </template>
          </Column>
          <Column field="returnYtd" header="YTD" sortable>
            <template #body="{ data }">
              <span :style="{ color: data.returnYtd >= 0 ? 'var(--p-green-500)' : 'var(--p-red-500)' }">
                {{ fmtPct(data.returnYtd) }}
              </span>
            </template>
          </Column>
          <Column field="weight" header="Weight" sortable style="min-width: 12rem">
            <template #body="{ data }">
              <div class="inline-bar-cell">
                <div class="inline-bar" :style="{ width: (data.weight / maxWeight * 100) + '%' }" />
                <span class="inline-bar-label">{{ data.weight.toFixed(1) }}%</span>
              </div>
            </template>
          </Column>
        </DataTable>
      </template>
    </Card>

    <!-- Heatmap Cells (full width) -->
    <Card class="section-gap">
      <template #title>Heatmap Cells</template>
      <template #content>
        <DataTable :value="heatmapData" size="small">
          <Column field="name" header="Portfolio" frozen style="min-width: 9rem" />
          <Column v-for="(m, i) in months" :key="m" :header="m" style="min-width: 4.5rem; text-align: center">
            <template #body="{ data }">
              <div class="heatmap-cell" :style="{ background: heatmapBg(data.returns[i]) }">
                <span :style="{ color: data.returns[i] >= 0 ? 'var(--p-green-600)' : 'var(--p-red-600)' }">
                  {{ data.returns[i] >= 0 ? '+' : '' }}{{ data.returns[i].toFixed(1) }}
                </span>
              </div>
            </template>
          </Column>
        </DataTable>
      </template>
    </Card>

    <!-- Column Filters (full width) -->
    <Card class="section-gap">
      <template #title>Column Filters</template>
      <template #content>
        <DataTable
          v-model:filters="filters"
          :value="filterableData"
          paginator
          :rows="8"
          filter-display="row"
          striped-rows
          size="small"
          :global-filter-fields="['instrument', 'sector', 'status']"
        >
          <template #header>
            <InputText v-model="filters['global'].value" placeholder="Search..." class="filter-search" />
          </template>
          <Column field="instrument" header="Instrument" sortable :show-filter-menu="false">
            <template #filter="{ filterModel, filterCallback }">
              <InputText v-model="filterModel.value" @input="filterCallback()" placeholder="Filter..." class="filter-input" />
            </template>
          </Column>
          <Column field="sector" header="Sector" sortable :show-filter-menu="false">
            <template #filter="{ filterModel, filterCallback }">
              <Select v-model="filterModel.value" @change="filterCallback()" :options="sectorOptions" placeholder="All" show-clear class="filter-input" />
            </template>
          </Column>
          <Column field="weight" header="Weight" sortable>
            <template #body="{ data }">{{ data.weight.toFixed(1) }}%</template>
          </Column>
          <Column field="pnl" header="P&L" sortable>
            <template #body="{ data }">
              <span :style="{ color: data.pnl >= 0 ? 'var(--p-green-500)' : 'var(--p-red-500)' }">
                {{ fmtCurrency(+data.pnl) }}
              </span>
            </template>
          </Column>
          <Column field="status" header="Status" sortable :show-filter-menu="false">
            <template #filter="{ filterModel, filterCallback }">
              <Select v-model="filterModel.value" @change="filterCallback()" :options="statusFilterOptions" placeholder="All" show-clear class="filter-input" />
            </template>
            <template #body="{ data }">
              <Tag :value="data.status" :severity="data.status === 'Active' ? 'success' : data.status === 'Watchlist' ? 'warn' : 'danger'" />
            </template>
          </Column>
        </DataTable>
      </template>
    </Card>

    <!-- TreeTable + Editable (2-col) -->
    <div class="showcase-grid section-gap">
      <Card>
        <template #title>TreeTable</template>
        <template #content>
          <TreeTable :value="treeNodes" size="small">
            <Column field="name" header="Name" expander />
            <Column field="weight" header="Weight">
              <template #body="{ node }">{{ node.data.weight.toFixed(1) }}%</template>
            </Column>
            <Column field="returnYtd" header="YTD Return">
              <template #body="{ node }">
                <span :style="{ color: node.data.returnYtd >= 0 ? 'var(--p-green-500)' : 'var(--p-red-500)' }">
                  {{ fmtPct(node.data.returnYtd) }}
                </span>
              </template>
            </Column>
            <Column field="var95" header="VaR 95%">
              <template #body="{ node }">{{ node.data.var95.toFixed(1) }}%</template>
            </Column>
          </TreeTable>
        </template>
      </Card>

      <Card>
        <template #title>Editable Cells</template>
        <template #content>
          <DataTable
            v-model:editing-rows="editingRows"
            :value="editableData"
            edit-mode="row"
            data-key="name"
            size="small"
            @row-edit-save="onRowEditSave"
          >
            <Column field="name" header="Asset Class" />
            <Column field="current" header="Current %">
              <template #body="{ data }">{{ data.current.toFixed(1) }}%</template>
            </Column>
            <Column field="target" header="Target %">
              <template #body="{ data }">{{ data.target.toFixed(1) }}%</template>
              <template #editor="{ data, field }">
                <InputNumber v-model="data[field]" :min="0" :max="100" suffix="%" :min-fraction-digits="1" :max-fraction-digits="1" class="edit-input" />
              </template>
            </Column>
            <Column field="limitMax" header="Limit Max">
              <template #body="{ data }">{{ data.limitMax.toFixed(1) }}%</template>
              <template #editor="{ data, field }">
                <InputNumber v-model="data[field]" :min="0" :max="100" suffix="%" :min-fraction-digits="1" :max-fraction-digits="1" class="edit-input" />
              </template>
            </Column>
            <Column :row-editor="true" style="width: 5rem; text-align: center" />
          </DataTable>
          <div class="edit-footer">
            Total target: <strong :class="{ 'over-limit': totalTarget > 100 }">{{ totalTarget.toFixed(1) }}%</strong>
          </div>
        </template>
      </Card>
    </div>

    <!-- Paginated (full width) -->
    <Card class="section-gap">
      <template #title>Paginated</template>
      <template #content>
        <DataTable
          :value="trades"
          paginator
          :rows="8"
          :rows-per-page-options="[5, 8, 15]"
          striped-rows
          size="small"
        >
          <Column field="id" header="Trade ID" sortable />
          <Column field="date" header="Date" sortable />
          <Column field="instrument" header="Instrument" sortable />
          <Column field="side" header="Side" sortable>
            <template #body="{ data }">
              <Tag :value="data.side" :severity="sideSeverity(data.side)" />
            </template>
          </Column>
          <Column field="quantity" header="Qty" sortable />
          <Column field="price" header="Price" sortable>
            <template #body="{ data }">{{ fmtCurrency(data.price) }}</template>
          </Column>
          <Column field="status" header="Status" sortable>
            <template #body="{ data }">
              <Tag :value="data.status" :severity="statusSeverity(data.status)" />
            </template>
          </Column>
        </DataTable>
      </template>
    </Card>

    <!-- Frozen + Grouped (full width) -->
    <Card class="section-gap">
      <template #title>Frozen Columns</template>
      <template #content>
        <DataTable :value="riskMetrics" scrollable scroll-height="400px" striped-rows size="small">
          <Column field="name" header="Portfolio" frozen style="min-width: 10rem" />
          <Column field="aum" header="AuM (CHF k)" style="min-width: 8rem">
            <template #body="{ data }">{{ fmtCurrency(data.aum) }}</template>
          </Column>
          <Column field="var95" header="VaR 95%" style="min-width: 7rem">
            <template #body="{ data }">{{ data.var95.toFixed(1) }}%</template>
          </Column>
          <Column field="var99" header="VaR 99%" style="min-width: 7rem">
            <template #body="{ data }">{{ data.var99.toFixed(1) }}%</template>
          </Column>
          <Column field="cvar" header="CVaR" style="min-width: 7rem">
            <template #body="{ data }">{{ data.cvar.toFixed(1) }}%</template>
          </Column>
          <Column field="te" header="Track. Error" style="min-width: 8rem">
            <template #body="{ data }">{{ data.te.toFixed(1) }}%</template>
          </Column>
          <Column field="beta" header="Beta" style="min-width: 6rem">
            <template #body="{ data }">{{ data.beta.toFixed(2) }}</template>
          </Column>
          <Column field="sharpe" header="Sharpe" style="min-width: 6rem">
            <template #body="{ data }">{{ data.sharpe.toFixed(2) }}</template>
          </Column>
          <Column field="sortino" header="Sortino" style="min-width: 7rem">
            <template #body="{ data }">{{ data.sortino.toFixed(2) }}</template>
          </Column>
          <Column field="maxDd" header="Max DD" style="min-width: 7rem">
            <template #body="{ data }">
              <span style="color: var(--p-red-500)">{{ data.maxDd.toFixed(1) }}%</span>
            </template>
          </Column>
          <Column field="volatility" header="Volatility" style="min-width: 7rem">
            <template #body="{ data }">{{ data.volatility.toFixed(1) }}%</template>
          </Column>
        </DataTable>
      </template>
    </Card>

    <!-- Expandable + Grouped Headers (2-col) -->
    <div class="showcase-grid section-gap">
      <Card>
        <template #title>Expandable Rows</template>
        <template #content>
          <DataTable v-model:expanded-rows="expandedRows" :value="positions" data-key="name" size="small">
            <Column expander style="width: 3rem" />
            <Column field="name" header="Asset Class" />
            <Column field="weight" header="Weight">
              <template #body="{ data }">{{ data.weight.toFixed(1) }}%</template>
            </Column>
            <Column field="returnYtd" header="YTD Return">
              <template #body="{ data }">
                <span :style="{ color: data.returnYtd >= 0 ? 'var(--p-green-500)' : 'var(--p-red-500)' }">
                  {{ fmtPct(data.returnYtd) }}
                </span>
              </template>
            </Column>
            <template #expansion="{ data }">
              <DataTable :value="data.children" size="small">
                <Column field="name" header="Sub-Class" />
                <Column field="weight" header="Weight">
                  <template #body="{ data: child }">{{ child.weight.toFixed(1) }}%</template>
                </Column>
                <Column field="returnYtd" header="YTD Return">
                  <template #body="{ data: child }">
                    <span :style="{ color: child.returnYtd >= 0 ? 'var(--p-green-500)' : 'var(--p-red-500)' }">
                      {{ fmtPct(child.returnYtd) }}
                    </span>
                  </template>
                </Column>
              </DataTable>
            </template>
          </DataTable>
        </template>
      </Card>

      <Card>
        <template #title>Grouped Headers</template>
        <template #content>
          <DataTable :value="groupedData" size="small">
            <ColumnGroup type="header">
              <Row>
                <Column header="Portfolio" :rowspan="2" />
                <Column header="Value at Risk (%)" :colspan="4" />
                <Column header="Stress Test (%)" :colspan="4" />
              </Row>
              <Row>
                <Column header="Market" sortable field="mktVar" />
                <Column header="Credit" sortable field="credVar" />
                <Column header="Liquidity" sortable field="liqVar" />
                <Column header="Total" sortable field="totalVar" />
                <Column header="Market" sortable field="mktStress" />
                <Column header="Credit" sortable field="credStress" />
                <Column header="Liquidity" sortable field="liqStress" />
                <Column header="Total" sortable field="totalStress" />
              </Row>
            </ColumnGroup>
            <Column field="name" />
            <Column field="mktVar">
              <template #body="{ data }">{{ data.mktVar.toFixed(1) }}</template>
            </Column>
            <Column field="credVar">
              <template #body="{ data }">{{ data.credVar.toFixed(1) }}</template>
            </Column>
            <Column field="liqVar">
              <template #body="{ data }">{{ data.liqVar.toFixed(1) }}</template>
            </Column>
            <Column field="totalVar">
              <template #body="{ data }"><strong>{{ data.totalVar.toFixed(1) }}</strong></template>
            </Column>
            <Column field="mktStress">
              <template #body="{ data }">
                <span style="color: var(--p-red-500)">{{ data.mktStress.toFixed(1) }}</span>
              </template>
            </Column>
            <Column field="credStress">
              <template #body="{ data }">
                <span style="color: var(--p-red-500)">{{ data.credStress.toFixed(1) }}</span>
              </template>
            </Column>
            <Column field="liqStress">
              <template #body="{ data }">
                <span style="color: var(--p-red-500)">{{ data.liqStress.toFixed(1) }}</span>
              </template>
            </Column>
            <Column field="totalStress">
              <template #body="{ data }">
                <strong style="color: var(--p-red-500)">{{ data.totalStress.toFixed(1) }}</strong>
              </template>
            </Column>
          </DataTable>
        </template>
      </Card>
    </div>
  </div>
</template>

<style scoped>
.showcase {
  max-width: 1400px;
}

.section-gap {
  margin-top: var(--app-space-lg);
}

.showcase-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: var(--app-space-lg);
}

@media (max-width: 768px) {
  .showcase-grid {
    grid-template-columns: 1fr;
  }
}

/* Sparkline SVG */
.sparkline {
  display: block;
}

/* Inline bar */
.inline-bar-cell {
  position: relative;
  height: 1.25rem;
}

.inline-bar {
  position: absolute;
  inset: 0;
  background: var(--p-surface-100);
  border-radius: 2px;
}

.inline-bar-label {
  position: relative;
  z-index: 1;
  font-size: 0.75rem;
  font-weight: 600;
  line-height: 1.25rem;
  padding-left: 0.375rem;
}

/* Heatmap */
.heatmap-cell {
  padding: 0.25rem 0.5rem;
  border-radius: 3px;
  text-align: center;
  font-size: 0.8125rem;
  font-weight: 500;
  font-variant-numeric: tabular-nums;
}

/* Filters */
.filter-search {
  width: 16rem;
}

.filter-input {
  width: 100%;
}

/* Editable */
.edit-input {
  width: 100%;
}

.edit-footer {
  margin-top: 0.75rem;
  font-size: 0.875rem;
  color: var(--p-surface-500);
  text-align: right;
}

.over-limit {
  color: var(--p-red-500);
}
</style>
