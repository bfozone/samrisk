<script setup lang="ts">
import AutoComplete from 'primevue/autocomplete'

import DatePicker from 'primevue/datepicker'
import FloatLabel from 'primevue/floatlabel'
import IconField from 'primevue/iconfield'
import InputGroup from 'primevue/inputgroup'
import InputGroupAddon from 'primevue/inputgroupaddon'
import InputIcon from 'primevue/inputicon'
import InputNumber from 'primevue/inputnumber'
import InputText from 'primevue/inputtext'
import Knob from 'primevue/knob'
import Slider from 'primevue/slider'
import Textarea from 'primevue/textarea'
import { ref } from 'vue'
import AppCard from '@/components/base/AppCard.vue'
import AppInputText from '@/components/base/AppInputText.vue'
import FlexStack from '@/components/base/FlexStack.vue'
import DashboardGrid from '@/components/DashboardGrid.vue'
import ShowcaseLayout from '@/components/ShowcaseLayout.vue'

// --- InputText ---
const name = ref('')
const email = ref('')

// --- Textarea ---
const notes = ref('')

// --- AutoComplete ---
const selectedIssuer = ref('')
const filteredIssuers = ref<string[]>([])
const allIssuers = [
  'Apple Inc.',
  'Alphabet Inc.',
  'Amazon.com Inc.',
  'ABB Ltd.',
  'Microsoft Corp.',
  'Meta Platforms',
  'Morgan Stanley',
  'Nestle SA',
  'Novartis AG',
  'Netflix Inc.',
  'Roche Holding',
  'Royal Dutch Shell',
  'Raiffeisen',
  'UBS Group AG',
  'Unilever PLC',
  'US Bancorp',
  'Swiss Re AG',
  'Swatch Group',
  'Siemens AG',
  'Credit Suisse',
  'Coca-Cola Co.',
  'Citigroup Inc.',
]
function searchIssuers(event: { query: string }) {
  const q = event.query.toLowerCase()
  filteredIssuers.value = allIssuers.filter(i => i.toLowerCase().includes(q))
}

// --- DatePicker ---
const singleDate = ref<Date>()
const dateRange = ref<Date[]>()

// --- Slider ---
const confidence = ref(95)
const rangeValues = ref([20, 80])

// --- Knob ---
const varUtil = ref(73)
const teUtil = ref(42)

// --- InputGroup ---
const amount = ref<number>()
const searchQuery = ref('')
</script>

<template>
  <ShowcaseLayout>
    <DashboardGrid>
      <AppCard>
        <template #title>
          Text Inputs
        </template>
        <template #content>
          <FlexStack gap="lg">
            <FloatLabel>
              <AppInputText id="name" v-model="name" class="demo-input" />
              <label for="name">Portfolio Name</label>
            </FloatLabel>
            <FloatLabel>
              <AppInputText id="email" v-model="email" class="demo-input" />
              <label for="email">Contact Email</label>
            </FloatLabel>
            <IconField>
              <InputIcon class="pi pi-search" />
              <AppInputText v-model="searchQuery" placeholder="Search holdings..." class="demo-input" />
            </IconField>
            <AppInputText placeholder="Disabled" disabled class="demo-input" />
            <AppInputText placeholder="Invalid input" invalid class="demo-input" />
          </FlexStack>
        </template>
      </AppCard>

      <AppCard>
        <template #title>
          Textarea
        </template>
        <template #content>
          <FlexStack gap="lg">
            <FloatLabel>
              <Textarea id="notes" v-model="notes" rows="4" class="demo-input" auto-resize />
              <label for="notes">Risk Commentary</label>
            </FloatLabel>
          </FlexStack>
        </template>
      </AppCard>

      <AppCard>
        <template #title>
          AutoComplete
        </template>
        <template #content>
          <FlexStack gap="lg">
            <AutoComplete
              v-model="selectedIssuer"
              :suggestions="filteredIssuers"
              placeholder="Search issuers..."
              class="demo-input"
              @complete="searchIssuers"
            />
            <span class="demo-hint">Try typing "A", "Swiss", or "UBS"</span>
          </FlexStack>
        </template>
      </AppCard>

      <AppCard>
        <template #title>
          Input Groups
        </template>
        <template #content>
          <FlexStack gap="lg">
            <InputGroup>
              <InputGroupAddon>CHF</InputGroupAddon>
              <InputNumber v-model="amount" placeholder="Amount" />
            </InputGroup>
            <InputGroup>
              <InputGroupAddon><i class="pi pi-percentage"></i></InputGroupAddon>
              <InputNumber v-model="confidence" suffix="%" :min="0" :max="100" />
              <InputGroupAddon>confidence</InputGroupAddon>
            </InputGroup>
            <InputGroup>
              <InputGroupAddon><i class="pi pi-calendar"></i></InputGroupAddon>
              <InputText placeholder="YYYY-MM-DD" />
              <InputGroupAddon><i class="pi pi-arrow-right"></i></InputGroupAddon>
              <InputText placeholder="YYYY-MM-DD" />
            </InputGroup>
          </FlexStack>
        </template>
      </AppCard>

      <AppCard>
        <template #title>
          Date Picker
        </template>
        <template #content>
          <FlexStack gap="lg">
            <FloatLabel>
              <DatePicker id="single" v-model="singleDate" date-format="dd.mm.yy" show-icon class="demo-input" />
              <label for="single">Valuation Date</label>
            </FloatLabel>
            <FloatLabel>
              <DatePicker id="range" v-model="dateRange" selection-mode="range" date-format="dd.mm.yy" show-icon class="demo-input" />
              <label for="range">Date Range</label>
            </FloatLabel>
          </FlexStack>
        </template>
      </AppCard>

      <AppCard>
        <template #title>
          Slider
        </template>
        <template #content>
          <FlexStack gap="lg">
            <div>
              <span class="demo-label">Confidence Level: {{ confidence }}%</span>
              <Slider v-model="confidence" :min="80" :max="99" />
            </div>
            <div>
              <span class="demo-label">Weight Range: {{ rangeValues[0] }}% - {{ rangeValues[1] }}%</span>
              <Slider v-model="rangeValues" range :min="0" :max="100" />
            </div>
          </FlexStack>
        </template>
      </AppCard>

      <AppCard>
        <template #title>
          Knob
        </template>
        <template #content>
          <div class="demo-knobs">
            <div class="demo-knob-item">
              <Knob v-model="varUtil" :size="120" :stroke-width="8" value-template="{value}%" />
              <span class="demo-label">VaR Utilization</span>
            </div>
            <div class="demo-knob-item">
              <Knob v-model="teUtil" :size="120" :stroke-width="8" value-template="{value}%" />
              <span class="demo-label">TE Utilization</span>
            </div>
          </div>
        </template>
      </AppCard>
    </DashboardGrid>
  </ShowcaseLayout>
</template>

<style scoped>
.demo-input {
  width: 100%;
}

.demo-label {
  font-size: 0.875rem;
  color: var(--p-surface-500);
  margin-bottom: 0.5rem;
  display: block;
}

.demo-hint {
  font-size: 0.75rem;
  color: var(--p-surface-400);
}

.demo-knobs {
  display: flex;
  gap: 2rem;
  justify-content: center;
}

.demo-knob-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
}
</style>
