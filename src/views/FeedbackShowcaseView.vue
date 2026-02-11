<script setup lang="ts">
import { useToast } from 'primevue/usetoast'

import ShowcaseLayout from '@/components/ShowcaseLayout.vue'
import DashboardGrid from '@/components/DashboardGrid.vue'
import FlexRow from '@/components/base/FlexRow.vue'
import FlexStack from '@/components/base/FlexStack.vue'
import AppCard from '@/components/base/AppCard.vue'
import AppButton from '@/components/base/AppButton.vue'
import AppTag from '@/components/base/AppTag.vue'
import Message from 'primevue/message'
import Toast from 'primevue/toast'
import ProgressBar from 'primevue/progressbar'

const toast = useToast()
</script>

<template>
  <ShowcaseLayout>
    <DashboardGrid>
      <AppCard>
        <template #title>Tags</template>
        <template #content>
          <FlexRow>
            <AppTag value="Low Risk" severity="success" />
            <AppTag value="Medium" severity="warn" />
            <AppTag value="High Risk" severity="danger" />
            <AppTag value="Informational" severity="info" />
            <AppTag value="In Review" severity="secondary" />
          </FlexRow>
        </template>
      </AppCard>

      <AppCard>
        <template #title>Messages</template>
        <template #content>
          <FlexStack gap="sm">
            <Message severity="info">Portfolio data refreshed at 09:15 UTC</Message>
            <Message severity="warn">VaR limit utilization above 80%</Message>
            <Message severity="error">Failed to load exposure data</Message>
            <Message severity="success">Risk report generated successfully</Message>
          </FlexStack>
        </template>
      </AppCard>

      <AppCard>
        <template #title>Toast</template>
        <template #content>
          <Toast />
          <FlexRow>
            <AppButton
              label="Show Notification"
              icon="pi pi-bell"
              @click="toast.add({ severity: 'info', summary: 'Risk Alert', detail: 'VaR breach detected on Growth Fund', life: 3000 })"
            />
          </FlexRow>
        </template>
      </AppCard>

      <AppCard>
        <template #title>Progress</template>
        <template #content>
          <FlexStack gap="sm">
            <div>
              <span class="demo-label">Determinate (73%)</span>
              <ProgressBar :value="73" />
            </div>
            <div>
              <span class="demo-label">Indeterminate</span>
              <ProgressBar mode="indeterminate" style="height: 6px" />
            </div>
          </FlexStack>
        </template>
      </AppCard>
    </DashboardGrid>
  </ShowcaseLayout>
</template>

<style scoped>
.demo-label {
  font-size: 0.875rem;
  color: var(--p-surface-500);
  margin-bottom: 0.25rem;
  display: block;
}
</style>
