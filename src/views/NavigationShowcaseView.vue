<script setup lang="ts">
import { ref } from 'vue'

import Card from 'primevue/card'
import Breadcrumb from 'primevue/breadcrumb'
import Stepper from 'primevue/stepper'
import StepList from 'primevue/steplist'
import StepPanels from 'primevue/steppanels'
import Step from 'primevue/step'
import StepPanel from 'primevue/steppanel'
import Button from 'primevue/button'
import ContextMenu from 'primevue/contextmenu'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import MeterGroup from 'primevue/metergroup'

// --- Breadcrumb ---
const home = { icon: 'pi pi-home', to: '/' }
const breadcrumbItems = [
  { label: 'Analytics' },
  { label: 'Growth Fund' },
  { label: 'Risk' },
]

// --- ContextMenu ---
const contextMenu = ref()
const contextMenuItems = [
  { label: 'View Details', icon: 'pi pi-eye' },
  { label: 'Edit Allocation', icon: 'pi pi-pencil' },
  { separator: true },
  { label: 'Export to CSV', icon: 'pi pi-download' },
  { label: 'Add to Watchlist', icon: 'pi pi-star' },
  { separator: true },
  { label: 'Remove', icon: 'pi pi-trash', class: 'text-red-500' },
]
const contextTableData = [
  { name: 'Apple Inc.', asset: 'Equities', weight: 8.2 },
  { name: 'US Treasury 10Y', asset: 'Fixed Income', weight: 6.5 },
  { name: 'Nestle SA', asset: 'Equities', weight: 4.8 },
  { name: 'iShares Gold', asset: 'Commodities', weight: 3.1 },
]
const selectedRow = ref()
function onRowContextMenu(event: { originalEvent: Event }) {
  contextMenu.value.show(event.originalEvent)
}

// --- MeterGroup ---
const meterValues = [
  { label: 'Equities', value: 45, color: '#2C5969' },
  { label: 'Fixed Income', value: 30, color: '#A5B077' },
  { label: 'Alternatives', value: 15, color: '#EAA159' },
  { label: 'Cash', value: 10, color: '#61828E' },
]
</script>

<template>
  <div class="showcase">
    <div class="showcase-grid">
      <Card>
        <template #title>Breadcrumb</template>
        <template #content>
          <div class="demo-stack">
            <Breadcrumb :home="home" :model="breadcrumbItems" />
            <Breadcrumb :home="home" :model="[{ label: 'Portfolios' }, { label: 'All Funds' }]" />
            <Breadcrumb :home="home" :model="[{ label: 'Reports' }, { label: 'Monthly' }, { label: 'Jan 2025' }]" />
          </div>
        </template>
      </Card>

      <Card>
        <template #title>Context Menu</template>
        <template #content>
          <span class="demo-hint">Right-click a row to see the context menu</span>
          <ContextMenu ref="contextMenu" :model="contextMenuItems" />
          <DataTable
            v-model:selection="selectedRow"
            :value="contextTableData"
            selection-mode="single"
            context-menu
            class="demo-table"
            @row-contextmenu="onRowContextMenu"
          >
            <Column field="name" header="Holding" />
            <Column field="asset" header="Asset Class" />
            <Column field="weight" header="Weight %">
              <template #body="{ data }">{{ data.weight.toFixed(1) }}%</template>
            </Column>
          </DataTable>
        </template>
      </Card>

      <Card class="span-2">
        <template #title>Stepper</template>
        <template #content>
          <Stepper value="1" linear>
            <StepList>
              <Step value="1">Select Portfolio</Step>
              <Step value="2">Configure Parameters</Step>
              <Step value="3">Review & Generate</Step>
            </StepList>
            <StepPanels>
              <StepPanel v-slot="{ activateCallback }" value="1">
                <div class="step-content">
                  <p>Choose the portfolio for risk report generation. Select from active portfolios with at least 30 days of history.</p>
                  <div class="step-actions">
                    <Button label="Next" icon="pi pi-arrow-right" icon-pos="right" @click="activateCallback('2')" />
                  </div>
                </div>
              </StepPanel>
              <StepPanel v-slot="{ activateCallback }" value="2">
                <div class="step-content">
                  <p>Set the confidence level, lookback window, and benchmark for risk calculations. Defaults are 95% VaR with 252-day lookback.</p>
                  <div class="step-actions">
                    <Button label="Back" severity="secondary" icon="pi pi-arrow-left" @click="activateCallback('1')" />
                    <Button label="Next" icon="pi pi-arrow-right" icon-pos="right" @click="activateCallback('3')" />
                  </div>
                </div>
              </StepPanel>
              <StepPanel v-slot="{ activateCallback }" value="3">
                <div class="step-content">
                  <p>Review your selections and generate the report. Processing typically takes 2-5 minutes depending on portfolio complexity.</p>
                  <div class="step-actions">
                    <Button label="Back" severity="secondary" icon="pi pi-arrow-left" @click="activateCallback('2')" />
                    <Button label="Generate Report" icon="pi pi-file" severity="success" />
                  </div>
                </div>
              </StepPanel>
            </StepPanels>
          </Stepper>
        </template>
      </Card>

      <Card class="span-2">
        <template #title>Meter Group</template>
        <template #content>
          <div class="demo-stack">
            <MeterGroup :value="meterValues" />
          </div>
        </template>
      </Card>
    </div>
  </div>
</template>

<style scoped>
.showcase {
  max-width: 1400px;
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

.span-2 {
  grid-column: span 2;
}

@media (max-width: 768px) {
  .span-2 {
    grid-column: span 1;
  }
}

.demo-stack {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.demo-hint {
  font-size: 0.75rem;
  color: var(--p-surface-400);
  display: block;
  margin-bottom: 0.75rem;
}

.demo-table {
  margin-top: 0.5rem;
}

.step-content {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding: 1rem 0;
}

.step-content p {
  color: var(--p-surface-600);
  font-size: 0.875rem;
  line-height: 1.5;
  margin: 0;
}

.step-actions {
  display: flex;
  gap: 0.5rem;
  justify-content: flex-end;
}
</style>
