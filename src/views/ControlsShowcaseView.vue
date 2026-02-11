<script setup lang="ts">
import { ref } from 'vue'

import ShowcaseLayout from '@/components/ShowcaseLayout.vue'
import DashboardGrid from '@/components/DashboardGrid.vue'
import FlexRow from '@/components/base/FlexRow.vue'
import AppCard from '@/components/base/AppCard.vue'
import AppButton from '@/components/base/AppButton.vue'
import AppSelect from '@/components/base/AppSelect.vue'
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
  <ShowcaseLayout>
    <DashboardGrid>
      <AppCard>
        <template #title>Buttons</template>
        <template #content>
          <FlexRow>
            <AppButton label="Primary" />
            <AppButton label="Secondary" severity="secondary" />
            <AppButton label="Outlined" outlined />
            <AppButton label="Text" text />
          </FlexRow>
          <FlexRow class="demo-row-gap">
            <AppButton label="Success" severity="success" />
            <AppButton label="Warning" severity="warn" />
            <AppButton label="Danger" severity="danger" />
          </FlexRow>
          <FlexRow class="demo-row-gap">
            <AppButton icon="pi pi-check" aria-label="Check" />
            <AppButton icon="pi pi-bookmark" severity="secondary" outlined aria-label="Bookmark" />
            <AppButton icon="pi pi-search" severity="success" rounded aria-label="Search" />
          </FlexRow>
          <FlexRow class="demo-row-gap">
            <AppButton label="Small" size="small" />
            <AppButton label="Normal" />
            <AppButton label="Large" size="large" />
          </FlexRow>
        </template>
      </AppCard>

      <AppCard>
        <template #title>Select</template>
        <template #content>
          <AppSelect
            v-model="selectedPortfolio"
            :options="portfolioOptions"
            option-label="label"
            option-value="value"
            placeholder="Select Portfolio"
            class="demo-input"
          />
        </template>
      </AppCard>

      <AppCard>
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
      </AppCard>

      <AppCard>
        <template #title>Segmented Toggle</template>
        <template #content>
          <SelectButton v-model="selectedFrequency" :options="frequencyOptions" />
        </template>
      </AppCard>

      <AppCard>
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
      </AppCard>

      <AppCard>
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
      </AppCard>

      <AppCard>
        <template #title>Filter Chips</template>
        <template #content>
          <FlexRow>
            <Chip
              v-for="item in chipItems"
              :key="item"
              :label="item"
              removable
              @remove="removeChip(item)"
            />
          </FlexRow>
        </template>
      </AppCard>
    </DashboardGrid>
  </ShowcaseLayout>
</template>

<style scoped>
.demo-row-gap {
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
