// Temporary mock data for the dashboard UI until the local database exists.
// Mirrors the real model: money in minor units, purchaseDate as YYYY-MM-DD.

import type { Category, Expense, PlanUsage } from '@/features/expenses/types';

export const MOCK_PLAN_USAGE: PlanUsage = {
  planId: 'free',
  scanCount: 12,
  monthlyScanLimit: 30,
};

export const MOCK_CATEGORIES: Category[] = [
  { id: 'c1a1b2c3-0001-4a00-8000-000000000001', name: 'Groceries', color: 'green', icon: 'shopping-basket' },
  { id: 'c1a1b2c3-0002-4a00-8000-000000000002', name: 'Food & Drink', color: 'amber', icon: 'utensils' },
  { id: 'c1a1b2c3-0003-4a00-8000-000000000003', name: 'Transport', color: 'blue', icon: 'car' },
  { id: 'c1a1b2c3-0004-4a00-8000-000000000004', name: 'Travel', color: 'violet', icon: 'plane' },
  { id: 'c1a1b2c3-0005-4a00-8000-000000000005', name: 'Office', color: 'slate', icon: 'package' },
  { id: 'c1a1b2c3-0006-4a00-8000-000000000006', name: 'Fuel', color: 'red', icon: 'fuel' },
];

// Totals sum to 61461 (USD 614.61) across 6 receipts.
export const MOCK_EXPENSES: Expense[] = [
  {
    id: 'e1a1b2c3-0001-4a00-8000-000000000001',
    merchant: 'Whole Foods Market',
    purchaseDate: '2026-10-10',
    totalMinor: 8742,
    currency: 'USD',
    taxMinor: 612,
    categoryId: 'c1a1b2c3-0001-4a00-8000-000000000001',
    notes: null,
    source: 'scan',
    syncStatus: 'pending',
  },
  {
    id: 'e1a1b2c3-0002-4a00-8000-000000000002',
    merchant: 'Uber',
    purchaseDate: '2026-10-09',
    totalMinor: 2315,
    currency: 'USD',
    taxMinor: null,
    categoryId: 'c1a1b2c3-0003-4a00-8000-000000000003',
    notes: null,
    source: 'scan',
    syncStatus: 'synced',
  },
  {
    id: 'e1a1b2c3-0003-4a00-8000-000000000003',
    merchant: 'Staples',
    purchaseDate: '2026-10-09',
    totalMinor: 4699,
    currency: 'USD',
    taxMinor: 346,
    categoryId: 'c1a1b2c3-0005-4a00-8000-000000000005',
    notes: 'Printer ink for client deliverables',
    source: 'scan',
    syncStatus: 'synced',
  },
  {
    id: 'e1a1b2c3-0004-4a00-8000-000000000004',
    merchant: 'Shell',
    purchaseDate: '2026-10-07',
    totalMinor: 5410,
    currency: 'USD',
    taxMinor: null,
    categoryId: 'c1a1b2c3-0006-4a00-8000-000000000006',
    notes: null,
    source: 'scan',
    syncStatus: 'synced',
  },
  {
    id: 'e1a1b2c3-0005-4a00-8000-000000000005',
    merchant: 'Blue Bottle Coffee',
    purchaseDate: '2026-10-05',
    totalMinor: 3775,
    currency: 'USD',
    taxMinor: 300,
    categoryId: 'c1a1b2c3-0002-4a00-8000-000000000002',
    notes: null,
    source: 'scan',
    syncStatus: 'synced',
  },
  {
    id: 'e1a1b2c3-0006-4a00-8000-000000000006',
    merchant: 'Delta Air Lines',
    purchaseDate: '2026-10-03',
    totalMinor: 36520,
    currency: 'USD',
    taxMinor: null,
    categoryId: 'c1a1b2c3-0004-4a00-8000-000000000004',
    notes: 'Flight to client onsite',
    source: 'manual',
    syncStatus: 'synced',
  },
];
