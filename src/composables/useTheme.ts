import { useLocalStorage, useMediaQuery } from '@vueuse/core'
import { computed, watch } from 'vue'

type ThemeMode = 'light' | 'dark' | 'system'

const mode = useLocalStorage<ThemeMode>('samrisk-theme', 'system')
const prefersDark = useMediaQuery('(prefers-color-scheme: dark)')

const isDark = computed(() =>
  mode.value === 'system' ? prefersDark.value : mode.value === 'dark',
)

watch(isDark, (dark) => {
  document.documentElement.classList.toggle('dark', dark)
}, { immediate: true })

export function useTheme() {
  function toggle() {
    mode.value = isDark.value ? 'light' : 'dark'
  }

  function set(m: ThemeMode) {
    mode.value = m
  }

  return {
    isDark,
    mode: computed(() => mode.value),
    toggle,
    set,
  }
}
