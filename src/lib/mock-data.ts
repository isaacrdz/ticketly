// Temporary mock data for the dashboard UI until the local database exists.
// Mirrors the real model: money in minor units, purchaseDate as YYYY-MM-DD.

import type { Category, Expense, MonthlyTotal, PlanUsage, Receipt } from '@/features/expenses/types';

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
    totalMinor: 1875,
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
    totalMinor: 38420,
    currency: 'USD',
    taxMinor: null,
    categoryId: 'c1a1b2c3-0004-4a00-8000-000000000004',
    notes: 'Flight to client onsite',
    source: 'manual',
    syncStatus: 'synced',
  },
];

// Totals for the months before the current one. The current month is derived from MOCK_EXPENSES.
export const MOCK_PREVIOUS_MONTHLY_TOTALS: MonthlyTotal[] = [
  { month: '2026-05', totalMinor: 98420, currency: 'USD' },
  { month: '2026-06', totalMinor: 112075, currency: 'USD' },
  { month: '2026-07', totalMinor: 104310, currency: 'USD' },
  { month: '2026-08', totalMinor: 121890, currency: 'USD' },
  { month: '2026-09', totalMinor: 136834, currency: 'USD' },
];

// Uber (scan) and Delta Air Lines (manual) have no receipt on purpose, to show the empty state.
export const MOCK_RECEIPTS: Receipt[] = [
  {
    id: 'a1a1b2c3-0001-4a00-8000-000000000001',
    expenseId: 'e1a1b2c3-0001-4a00-8000-000000000001',
    mimeType: 'image/png',
    width: 900,
    height: 900,
    sizeBytes: 87719,
    image: require('../../assets/receipts/receipt-grocery.png'),
  },
  {
    id: 'a1a1b2c3-0003-4a00-8000-000000000003',
    expenseId: 'e1a1b2c3-0003-4a00-8000-000000000003',
    mimeType: 'image/png',
    width: 900,
    height: 900,
    sizeBytes: 63581,
    image: require('../../assets/receipts/receipt-generic.png'),
  },
  {
    id: 'a1a1b2c3-0004-4a00-8000-000000000004',
    expenseId: 'e1a1b2c3-0004-4a00-8000-000000000004',
    mimeType: 'image/png',
    width: 900,
    height: 900,
    sizeBytes: 63581,
    image: require('../../assets/receipts/receipt-generic.png'),
  },
  {
    id: 'a1a1b2c3-0005-4a00-8000-000000000005',
    expenseId: 'e1a1b2c3-0005-4a00-8000-000000000005',
    mimeType: 'image/png',
    width: 900,
    height: 900,
    sizeBytes: 63581,
    image: require('../../assets/receipts/receipt-generic.png'),
  },
];
