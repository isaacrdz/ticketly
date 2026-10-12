import { useQuery } from '@tanstack/react-query';

import type { Category, Expense, PlanUsage, Receipt } from '../types';
import { MOCK_CATEGORIES, MOCK_EXPENSES, MOCK_PLAN_USAGE, MOCK_RECEIPTS } from '@/lib/mock-data';

export const expensesQueryKey = ['expenses'] as const;

export interface ExpensesData {
  expenses: Expense[];
  categories: Category[];
  planUsage: PlanUsage;
  receipts: Receipt[];
}

// Returns mock data for now. Swap the queryFn for local SQLite queries later.
export function useExpenses() {
  return useQuery({
    queryKey: expensesQueryKey,
    // Mock data never changes on its own, and a refetch would undo deletes made in the cache.
    staleTime: Infinity,
    queryFn: async (): Promise<ExpensesData> => ({
      expenses: MOCK_EXPENSES,
      categories: MOCK_CATEGORIES,
      planUsage: MOCK_PLAN_USAGE,
      receipts: MOCK_RECEIPTS,
    }),
  });
}
