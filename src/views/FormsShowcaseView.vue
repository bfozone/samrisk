<script setup lang="ts">
import { ref } from 'vue'

import AppCard from '@/components/base/AppCard.vue'
import InputText from 'primevue/inputtext'
import Textarea from 'primevue/textarea'
import AutoComplete from 'primevue/autocomplete'
import InputGroup from 'primevue/inputgroup'
import InputGroupAddon from 'primevue/inputgroupaddon'
import DatePicker from 'primevue/datepicker'
import Slider from 'primevue/slider'
import Knob from 'primevue/knob'
import InputNumber from 'primevue/inputnumber'
import FloatLabel from 'primevue/floatlabel'
import IconField from 'primevue/iconfield'
import InputIcon from 'primevue/inputicon'

// --- InputText ---
const name = ref('')
const email = ref('')

// --- Textarea ---
const notes = ref('')

// --- AutoComplete ---
const selectedIssuer = ref('')
const filteredIssuers = ref<string[]>([])
const allIssuers = [
  'Apple Inc.', 'Alphabet Inc.', 'Amazon.com Inc.', 'ABB Ltd.',
  'Microsoft Corp.', 'Meta Platforms', 'Morgan Stanley',
  'Nestle SA', 'Novartis AG', 'Netflix Inc.',
  'Roche Holding', 'Royal Dutch Shell', 'Raiffeisen',
  'UBS Group AG', 'Unilever PLC', 'US Bancorp',
  'Swiss Re AG', 'Swatch Group', 'Siemens AG',
  'Credit Suisse', 'Coca-Cola Co.', 'Citigroup Inc.',
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
  <div class="showcase">
    <div class="showcase-grid">
      <AppCard>
        <template #title>Text Inputs</template>
        <template #content>
          <div class="demo-stack">
            <FloatLabel>
              <InputText id="name" v-model="name" class="demo-input" />
              <label for="name">Portfolio Name</label>
            </FloatLabel>
            <FloatLabel>
              <InputText id="email" v-model="email" class="demo-input" />
              <label for="email">Contact Email</label>
            </FloatLabel>
            <IconField>
              <InputIcon class="pi pi-search" />
              <InputText v-model="searchQuery" placeholder="Search holdings..." class="demo-input" />
            </IconField>
            <InputText placeholder="Disabled" disabled class="demo-input" />
            <InputText placeholder="Invalid input" invalid class="demo-input" />
          </div>
        </template>
      </AppCard>

      <AppCard>
        <template #title>Textarea</template>
        <template #content>
          <div class="demo-stack">
            <FloatLabel>
              <Textarea id="notes" v-model="notes" rows="4" class="demo-input" auto-resize />
              <label for="notes">Risk Commentary</label>
            </FloatLabel>
          </div>
        </template>
      </AppCard>

      <AppCard>
        <template #title>AutoComplete</template>
        <template #content>
          <div class="demo-stack">
            <AutoComplete
              v-model="selectedIssuer"
              :suggestions="filteredIssuers"
              placeholder="Search issuers..."
              class="demo-input"
              @complete="searchIssuers"
            />
            <span class="demo-hint">Try typing "A", "Swiss", or "UBS"</span>
          </div>
        </template>
      </AppCard>

      <AppCard>
        <template #title>Input Groups</template>
        <template #content>
          <div class="demo-stack">
            <InputGroup>
              <InputGroupAddon>CHF</InputGroupAddon>
              <InputNumber v-model="amount" placeholder="Amount" />
            </InputGroup>
            <InputGroup>
              <InputGroupAddon><i class="pi pi-percentage" /></InputGroupAddon>
              <InputNumber v-model="confidence" suffix="%" :min="0" :max="100" />
              <InputGroupAddon>confidence</InputGroupAddon>
            </InputGroup>
            <InputGroup>
              <InputGroupAddon><i class="pi pi-calendar" /></InputGroupAddon>
              <InputText placeholder="YYYY-MM-DD" />
              <InputGroupAddon><i class="pi pi-arrow-right" /></InputGroupAddon>
              <InputText placeholder="YYYY-MM-DD" />
            </InputGroup>
          </div>
        </template>
      </AppCard>

      <AppCard>
        <template #title>Date Picker</template>
        <template #content>
          <div class="demo-stack">
            <FloatLabel>
              <DatePicker id="single" v-model="singleDate" date-format="dd.mm.yy" show-icon class="demo-input" />
              <label for="single">Valuation Date</label>
            </FloatLabel>
            <FloatLabel>
              <DatePicker id="range" v-model="dateRange" selection-mode="range" date-format="dd.mm.yy" show-icon class="demo-input" />
              <label for="range">Date Range</label>
            </FloatLabel>
          </div>
        </template>
      </AppCard>

      <AppCard>
        <template #title>Slider</template>
        <template #content>
          <div class="demo-stack">
            <div>
              <span class="demo-label">Confidence Level: {{ confidence }}%</span>
              <Slider v-model="confidence" :min="80" :max="99" />
            </div>
            <div>
              <span class="demo-label">Weight Range: {{ rangeValues[0] }}% - {{ rangeValues[1] }}%</span>
              <Slider v-model="rangeValues" range :min="0" :max="100" />
            </div>
          </div>
        </template>
      </AppCard>

      <AppCard>
        <template #title>Knob</template>
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

.demo-input {
  width: 100%;
}

.demo-stack {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
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
