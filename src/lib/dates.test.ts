import { describe, expect, it } from 'vitest';

import {
  formatDayHeader,
  formatLongDate,
  formatMonthDay,
  formatMonthName,
  formatMonthShort,
  formatMonthYear,
  getMonthKey,
} from './dates';

describe('formatLongDate', () => {
  it('formats a calendar date with the full weekday and month', () => {
    expect(formatLongDate('2026-10-10')).toBe('Saturday, October 10, 2026');
  });

  it('does not shift the day with the timezone', () => {
    expect(formatLongDate('2026-01-01')).toBe('Thursday, January 1, 2026');
    expect(formatLongDate('2026-12-31')).toBe('Thursday, December 31, 2026');
  });

  it('handles leap days', () => {
    expect(formatLongDate('2028-02-29')).toBe('Tuesday, February 29, 2028');
  });
});

describe('formatDayHeader', () => {
  it('uses an uppercase short weekday and month', () => {
    expect(formatDayHeader('2026-10-10')).toBe('SAT, OCT 10');
    expect(formatDayHeader('2026-10-07')).toBe('WED, OCT 7');
  });
});

describe('month helpers', () => {
  it('formats month and day', () => {
    expect(formatMonthDay('2026-10-10')).toBe('October 10');
  });

  it('formats month and year', () => {
    expect(formatMonthYear('2026-10-10')).toBe('October 2026');
  });

  it('returns the YYYY-MM key', () => {
    expect(getMonthKey('2026-10-10')).toBe('2026-10');
  });

  it('names a month from a month key or a full date', () => {
    expect(formatMonthName('2026-09')).toBe('September');
    expect(formatMonthName('2026-09-30')).toBe('September');
    expect(formatMonthShort('2026-05')).toBe('May');
  });
});
