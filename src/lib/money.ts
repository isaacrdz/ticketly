// Amounts are integer minor units (1999 = 19.99). Assumes 2-decimal currencies.
export function formatMoney(minor: number, currency: string): string {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency }).format(minor / 100);
}
