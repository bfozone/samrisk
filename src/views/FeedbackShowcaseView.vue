<script setup lang="ts">
import { useToast } from 'primevue/usetoast'

import AppCard from '@/components/base/AppCard.vue'
import AppButton from '@/components/base/AppButton.vue'
import Tag from 'primevue/tag'
import Message from 'primevue/message'
import Toast from 'primevue/toast'
import ProgressBar from 'primevue/progressbar'

const toast = useToast()
</script>

<template>
  <div class="showcase">
    <div class="showcase-grid">
      <AppCard>
        <template #title>Tags</template>
        <template #content>
          <div class="demo-row">
            <Tag value="Low Risk" severity="success" />
            <Tag value="Medium" severity="warn" />
            <Tag value="High Risk" severity="danger" />
            <Tag value="Informational" severity="info" />
            <Tag value="In Review" severity="secondary" />
          </div>
        </template>
      </AppCard>

      <AppCard>
        <template #title>Messages</template>
        <template #content>
          <div class="demo-stack">
            <Message severity="info">Portfolio data refreshed at 09:15 UTC</Message>
            <Message severity="warn">VaR limit utilization above 80%</Message>
            <Message severity="error">Failed to load exposure data</Message>
            <Message severity="success">Risk report generated successfully</Message>
          </div>
        </template>
      </AppCard>

      <AppCard>
        <template #title>Toast</template>
        <template #content>
          <Toast />
          <div class="demo-row">
            <AppButton
              label="Show Notification"
              icon="pi pi-bell"
              @click="toast.add({ severity: 'info', summary: 'Risk Alert', detail: 'VaR breach detected on Growth Fund', life: 3000 })"
            />
          </div>
        </template>
      </AppCard>

      <AppCard>
        <template #title>Progress</template>
        <template #content>
          <div class="demo-stack">
            <div>
              <span class="demo-label">Determinate (73%)</span>
              <ProgressBar :value="73" />
            </div>
            <div>
              <span class="demo-label">Indeterminate</span>
              <ProgressBar mode="indeterminate" style="height: 6px" />
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

.demo-row {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.5rem;
}

.demo-stack {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.demo-label {
  font-size: 0.875rem;
  color: var(--p-surface-500);
  margin-bottom: 0.25rem;
  display: block;
}
</style>
