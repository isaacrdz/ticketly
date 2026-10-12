/** Whole-number percentage of a total, like "63%". */
export function formatPercent(part: number, total: number): string {
  if (total === 0) return '0%';
  return `${Math.round((part / total) * 100)}%`;
}
