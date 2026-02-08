import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { VueQueryPlugin } from '@tanstack/vue-query'
import PrimeVue from 'primevue/config'
import RiskAppPreset from './theme/preset'
import router from './router'
import App from './App.vue'

import 'primeicons/primeicons.css'
import './assets/main.css'
import './plugins/echarts'

async function bootstrap() {
  if (import.meta.env.DEV) {
    const { worker } = await import('./mocks/browser')
    await worker.start({ onUnhandledRequest: 'bypass' })
  }

  const app = createApp(App)

  app.use(createPinia())
  app.use(router)
  app.use(VueQueryPlugin)
  app.use(PrimeVue, {
    theme: {
      preset: RiskAppPreset,
    },
  })

  app.mount('#app')
}

bootstrap()
