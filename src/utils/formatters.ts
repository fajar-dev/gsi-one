
export function formatDateDisplay(date: Date | string | null | undefined, fallback: string = '-'): string {
  if (!date) return fallback;
  const d = typeof date === 'string' ? new Date(date) : date;
  if (isNaN(d.getTime())) return fallback;

  return d.toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

// Pakai komponen tanggal LOKAL, bukan toISOString(): di WIB (UTC+7) tengah malam
// 2 Jan menjadi 1 Jan 17:00Z, sehingga setiap tanggal bergeser satu hari mundur.
export function formatDateDb(date?: Date | string | null, fallback: string = ''): string {
  if (!date) return fallback;
  const d = typeof date === 'string' ? new Date(date) : date;
  if (isNaN(d.getTime())) return fallback;
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function formatCurrency(val?: number | null, fallback: string = '-'): string {
  if (val == null || isNaN(val)) return fallback;
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
  }).format(val);
}
