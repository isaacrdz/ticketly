import { describe, expect, it } from 'vitest';

import { formatMoney } from './money';

describe('formatMoney', () => {
  it('converts minor units to a currency string', () => {
    expect(formatMoney(8742, 'USD')).toBe('$87.42');
  });

  it('keeps two decimals and handles zero', () => {
    expect(formatMoney(0, 'USD')).toBe('$0.00');
    expect(formatMoney(5, 'USD')).toBe('$0.05');
  });

  it('adds thousands separators', () => {
    expect(formatMoney(634990, 'USD')).toBe('$6,349.90');
  });

  it('uses the currency code given', () => {
    expect(formatMoney(1999, 'EUR')).toBe('€19.99');
  });
});
