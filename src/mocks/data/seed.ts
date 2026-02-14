/** Seeded pseudo-random for reproducible mock data */
export function seededRandom(seed: number) {
  let s = seed
  return () => {
    s = (s * 1664525 + 1013904223) & 0x7FFFFFFF
    return s / 0x7FFFFFFF
  }
}

export function lastNWeekdays(n: number): string[] {
  const dates: string[] = []
  const d = new Date()
  while (dates.length < n) {
    d.setDate(d.getDate() - 1)
    const day = d.getDay()
    if (day !== 0 && day !== 6) {
      dates.push(d.toISOString().slice(0, 10))
    }
  }
  return dates.reverse()
}
