import { toast } from 'vue-sonner'

export function addToast(opts: { severity: string, summary: string, detail?: string, life?: number }) {
  const fn = opts.severity === 'error'
    ? toast.error
    : opts.severity === 'warn'
      ? toast.warning
      : opts.severity === 'success'
        ? toast.success
        : toast.info
  fn(opts.summary, { description: opts.detail, duration: opts.life })
}

/** Legacy compat - returns an object with add() for existing callsites */
export function getToastRef() {
  return { add: addToast }
}

export function setToastRef(_t: unknown) {
  // No-op: kept for backwards compatibility during migration
}
