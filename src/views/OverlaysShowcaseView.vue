<script setup lang="ts">
import { ref } from 'vue'

import AppCard from '@/components/base/AppCard.vue'
import AppButton from '@/components/base/AppButton.vue'
import Dialog from 'primevue/dialog'
import Popover from 'primevue/popover'
import Tabs from 'primevue/tabs'
import TabList from 'primevue/tablist'
import Tab from 'primevue/tab'
import TabPanels from 'primevue/tabpanels'
import TabPanel from 'primevue/tabpanel'
import Accordion from 'primevue/accordion'
import AccordionPanel from 'primevue/accordionpanel'
import AccordionHeader from 'primevue/accordionheader'
import AccordionContent from 'primevue/accordioncontent'

const dialogVisible = ref(false)
const popoverRef = ref()

function togglePopover(event: Event) {
  popoverRef.value.toggle(event)
}
</script>

<template>
  <div class="showcase">
    <div class="showcase-grid">
      <AppCard>
        <template #title>Dialog</template>
        <template #content>
          <AppButton label="Open Dialog" icon="pi pi-external-link" @click="dialogVisible = true" />
          <Dialog v-model:visible="dialogVisible" header="Confirm Action" modal :style="{ width: '28rem' }">
            <p>Are you sure you want to recalculate the risk metrics for all portfolios?</p>
            <template #footer>
              <AppButton label="Cancel" text @click="dialogVisible = false" />
              <AppButton label="Confirm" @click="dialogVisible = false" />
            </template>
          </Dialog>
        </template>
      </AppCard>

      <AppCard>
        <template #title>Popover</template>
        <template #content>
          <AppButton label="Show Details" icon="pi pi-info-circle" outlined @click="togglePopover" />
          <Popover ref="popoverRef">
            <div class="popover-content">
              <p><strong>Portfolio:</strong> Growth Fund</p>
              <p><strong>AuM:</strong> CHF 162'000</p>
              <p><strong>VaR (95%):</strong> 2.4%</p>
              <p><strong>Tracking Error:</strong> 1.6%</p>
            </div>
          </Popover>
        </template>
      </AppCard>

      <AppCard>
        <template #title>Tabs</template>
        <template #content>
          <Tabs value="0">
            <TabList>
              <Tab value="0">By Factor</Tab>
              <Tab value="1">By Region</Tab>
              <Tab value="2">By Issuer</Tab>
            </TabList>
            <TabPanels>
              <TabPanel value="0">
                <p class="tab-body">Factor decomposition: Market, Size, Value, Momentum, Quality</p>
              </TabPanel>
              <TabPanel value="1">
                <p class="tab-body">Regional breakdown: Americas 52%, EMEA 28%, APAC 20%</p>
              </TabPanel>
              <TabPanel value="2">
                <p class="tab-body">Top issuers: US Treasury, Apple, Microsoft, JPMorgan, Nestle</p>
              </TabPanel>
            </TabPanels>
          </Tabs>
        </template>
      </AppCard>

      <AppCard>
        <template #title>Accordion</template>
        <template #content>
          <Accordion value="0">
            <AccordionPanel value="0">
              <AccordionHeader>VaR Methodology</AccordionHeader>
              <AccordionContent>
                <p>Historical simulation using 500-day rolling window with exponential decay weighting (lambda = 0.94).</p>
              </AccordionContent>
            </AccordionPanel>
            <AccordionPanel value="1">
              <AccordionHeader>Stress Testing</AccordionHeader>
              <AccordionContent>
                <p>Scenarios include 2008 GFC, 2020 COVID crash, and custom hypothetical shocks across rates, credit, and equity factors.</p>
              </AccordionContent>
            </AccordionPanel>
            <AccordionPanel value="2">
              <AccordionHeader>Liquidity Metrics</AccordionHeader>
              <AccordionContent>
                <p>Time-to-liquidation estimates based on ADV percentages and bid-ask spread analysis across market regimes.</p>
              </AccordionContent>
            </AccordionPanel>
          </Accordion>
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

.popover-content {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.popover-content p {
  margin: 0;
  font-size: 0.875rem;
}

.tab-body {
  margin: 0;
  padding: 0.75rem 0;
  font-size: 0.875rem;
  color: var(--p-surface-600);
}
</style>
