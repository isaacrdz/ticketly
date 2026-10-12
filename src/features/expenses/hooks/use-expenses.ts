import { useQuery } from '@tanstack/react-query';

import { MOCK_CATEGORIES, MOCK_EXPENSES, MOCK_PLAN_USAGE } from '@/lib/mock-data';

export const expensesQueryKey = ['expenses'] as const;

// Returns mock data for now. Swap the queryFn for local SQLite queries later.
export function useExpenses() {
  return useQuery({
    queryKey: expensesQueryKey,
    queryFn: async () => ({
      expenses: MOCK_EXPENSES,
      categories: MOCK_CATEGORIES,
      planUsage: MOCK_PLAN_USAGE,
    }),
  });
}
