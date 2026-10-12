import { describe, expect, it } from 'vitest';

import { formatPercent } from './percent';

describe('formatPercent', () => {
  it('rounds to a whole number', () => {
    expect(formatPercent(38420, 61461)).toBe('63%');
    expect(formatPercent(1875, 61461)).toBe('3%');
  });

  it('returns 0% when the total is zero instead of dividing by zero', () => {
    expect(formatPercent(0, 0)).toBe('0%');
  });

  it('handles the full total', () => {
    expect(formatPercent(100, 100)).toBe('100%');
  });
});
