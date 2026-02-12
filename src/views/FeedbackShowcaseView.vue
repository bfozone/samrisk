<script setup lang="ts">
import { useToast } from 'primevue/usetoast'

import ShowcaseLayout from '@/components/ShowcaseLayout.vue'
import DashboardGrid from '@/components/DashboardGrid.vue'
import FlexRow from '@/components/base/FlexRow.vue'
import FlexStack from '@/components/base/FlexStack.vue'
import AppCard from '@/components/base/AppCard.vue'
import AppButton from '@/components/base/AppButton.vue'
import AppTag from '@/components/base/AppTag.vue'
import InfoCard from '@/components/base/InfoCard.vue'
import QueryError from '@/components/base/QueryError.vue'
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

    <DashboardGrid>
      <AppCard>
        <template #title>Info Cards</template>
        <template #content>
          <FlexStack gap="sm">
            <InfoCard severity="error" title="Limit breach">
              VaR 95% exceeds the approved risk budget by 12%. Immediate action required.
            </InfoCard>
            <InfoCard severity="warn" title="Approaching threshold">
              Credit exposure to Issuer XYZ is at 78% of the single-name limit.
            </InfoCard>
            <InfoCard severity="success" title="Report published">
              Monthly risk report for January 2025 has been generated and distributed.
            </InfoCard>
            <InfoCard severity="info" title="Data refresh">
              Portfolio positions updated as of 2025-01-15 09:00 UTC.
            </InfoCard>
          </FlexStack>
        </template>
      </AppCard>

      <AppCard>
        <template #title>Query Error State</template>
        <template #content>
          <FlexStack gap="md">
            <span class="demo-label">Default (with retry)</span>
            <QueryError :on-retry="() => {}" />
            <span class="demo-label">Custom message (no retry)</span>
            <QueryError message="No positions found for this portfolio" />
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
