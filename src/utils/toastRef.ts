import type { ToastServiceMethods } from 'primevue/toastservice'

let ref: ToastServiceMethods | null = null

export function setToastRef(t: ToastServiceMethods) {
  ref = t
}

export function getToastRef() {
  return ref
}
