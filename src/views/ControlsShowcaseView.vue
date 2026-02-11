<script setup lang="ts">
import { ref } from 'vue'

import Card from 'primevue/card'
import Button from 'primevue/button'
import Select from 'primevue/select'
import MultiSelect from 'primevue/multiselect'
import SelectButton from 'primevue/selectbutton'
import ToggleSwitch from 'primevue/toggleswitch'
import InputNumber from 'primevue/inputnumber'
import Chip from 'primevue/chip'

const selectedPortfolio = ref<string | null>(null)
const portfolioOptions = [
  { label: 'Growth Fund', value: 'growth' },
  { label: 'Income Fund', value: 'income' },
  { label: 'Multi-Asset', value: 'multi' },
  { label: 'Balanced Fund', value: 'balanced' },
]

const selectedAssetClasses = ref<string[]>([])
const assetClassOptions = [
  { label: 'Equities', value: 'equities' },
  { label: 'Fixed Income', value: 'fixed-income' },
  { label: 'Alternatives', value: 'alternatives' },
  { label: 'Real Estate', value: 'real-estate' },
  { label: 'Cash', value: 'cash' },
]

const frequencyOptions = ['Daily', 'Weekly', 'Monthly']
const selectedFrequency = ref('Daily')

const showBenchmark = ref(true)
const enableAlerts = ref(false)

const varThreshold = ref(95)

const chipItems = ref(['Equities', 'IG Credit', 'Govt Bonds', 'HY Credit'])
function removeChip(label: string) {
  chipItems.value = chipItems.value.filter(c => c !== label)
}
</script>

<template>
  <div class="showcase">
    <div class="showcase-grid">
      <Card>
        <template #title>Buttons</template>
        <template #content>
          <div class="demo-row">
            <Button label="Primary" />
            <Button label="Secondary" severity="secondary" />
            <Button label="Outlined" outlined />
            <Button label="Text" text />
          </div>
          <div class="demo-row">
            <Button label="Success" severity="success" />
            <Button label="Warning" severity="warn" />
            <Button label="Danger" severity="danger" />
          </div>
          <div class="demo-row">
            <Button icon="pi pi-check" aria-label="Check" />
            <Button icon="pi pi-bookmark" severity="secondary" outlined aria-label="Bookmark" />
            <Button icon="pi pi-search" severity="success" rounded aria-label="Search" />
          </div>
          <div class="demo-row">
            <Button label="Small" size="small" />
            <Button label="Normal" />
            <Button label="Large" size="large" />
          </div>
        </template>
      </Card>

      <Card>
        <template #title>Select</template>
        <template #content>
          <Select
            v-model="selectedPortfolio"
            :options="portfolioOptions"
            option-label="label"
            option-value="value"
            placeholder="Select Portfolio"
            class="demo-input"
          />
        </template>
      </Card>

      <Card>
        <template #title>MultiSelect</template>
        <template #content>
          <MultiSelect
            v-model="selectedAssetClasses"
            :options="assetClassOptions"
            option-label="label"
            option-value="value"
            placeholder="Select Asset Classes"
            display="chip"
            class="demo-input"
          />
        </template>
      </Card>

      <Card>
        <template #title>Segmented Toggle</template>
        <template #content>
          <SelectButton v-model="selectedFrequency" :options="frequencyOptions" />
        </template>
      </Card>

      <Card>
        <template #title>Toggle Switch</template>
        <template #content>
          <div class="demo-toggles">
            <div class="demo-toggle-row">
              <ToggleSwitch v-model="showBenchmark" />
              <span>Show Benchmark</span>
            </div>
            <div class="demo-toggle-row">
              <ToggleSwitch v-model="enableAlerts" />
              <span>Enable Alerts</span>
            </div>
          </div>
        </template>
      </Card>

      <Card>
        <template #title>Number Input</template>
        <template #content>
          <InputNumber
            v-model="varThreshold"
            suffix="%"
            :min="0"
            :max="100"
            class="demo-input"
          />
        </template>
      </Card>

      <Card>
        <template #title>Filter Chips</template>
        <template #content>
          <div class="demo-row">
            <Chip
              v-for="item in chipItems"
              :key="item"
              :label="item"
              removable
              @remove="removeChip(item)"
            />
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

.demo-row {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.5rem;
}

.demo-row + .demo-row {
  margin-top: 0.75rem;
}

.demo-input {
  width: 100%;
  max-width: 20rem;
}

.demo-toggles {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.demo-toggle-row {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}
</style>
