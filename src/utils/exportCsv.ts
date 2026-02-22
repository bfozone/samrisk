export interface CsvColumn<T> {
  header: string
  accessor: (row: T) => string | number
}

function escapeField(value: string | number): string {
  const str = String(value)
  if (str.includes(',') || str.includes('"') || str.includes('\n') || str.includes('\r')) {
    return `"${str.replace(/"/g, '""')}"`
  }
  return str
}

export function exportCsv<T>(filename: string, columns: CsvColumn<T>[], rows: T[]): void {
  const header = columns.map(c => escapeField(c.header)).join(',')
  const body = rows.map(row =>
    columns.map(c => escapeField(c.accessor(row))).join(','),
  ).join('\n')

  const csv = `${header}\n${body}`
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)

  const link = document.createElement('a')
  link.href = url
  link.download = filename.endsWith('.csv') ? filename : `${filename}.csv`
  link.click()

  URL.revokeObjectURL(url)
}
