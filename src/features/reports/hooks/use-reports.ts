import { useQuery } from '@tanstack/react-query';

import { useExpenses } from '@/features/expenses/hooks/use-expenses';
import type { Category, MonthlyTotal } from '@/features/expenses/types';
import { getMonthKey } from '@/lib/dates';
import { MOCK_PREVIOUS_MONTHLY_TOTALS } from '@/lib/mock-data';

const MONTHS_SHOWN = 6;

export interface CategoryTotal {
  categoryId: string | null;
  category: Category | null;
  totalMinor: number;
}

export interface Reports {
  /** YYYY-MM of the current month */
  month: string;
  currency: string;
  /** Oldest to newest, ending with the current month */
  months: MonthlyTotal[];
  rangeTotalMinor: number;
  monthTotalMinor: number;
  /** Current month, largest first */
  categoryTotals: CategoryTotal[];
  isPro: boolean;
}

// Returns mock data for now. Swap the queryFn for local SQLite queries later.
function usePreviousMonthlyTotals() {
  return useQuery({
    queryKey: ['monthly-totals'],
    queryFn: async () => MOCK_PREVIOUS_MONTHLY_TOTALS,
  });
}

export function useReports(): { isPending: boolean; reports: Reports | null } {
  const expensesQuery = useExpenses();
  const previousQuery = usePreviousMonthlyTotals();

  if (!expensesQuery.data || !previousQuery.data) return { isPending: true, reports: null };

  const { expenses, categories, planUsage } = expensesQuery.data;
  if (expenses.length === 0) return { isPending: false, reports: null };

  const month = expenses.map((expense) => getMonthKey(expense.purchaseDate)).sort().at(-1)!;
  const monthExpenses = expenses.filter((expense) => getMonthKey(expense.purchaseDate) === month);
  const currency = monthExpenses[0].currency;
  const monthTotalMinor = monthExpenses.reduce((sum, expense) => sum + expense.totalMinor, 0);

  const totalsByCategory = new Map<string | null, number>();
  for (const expense of monthExpenses) {
    totalsByCategory.set(
      expense.categoryId,
      (totalsByCategory.get(expense.categoryId) ?? 0) + expense.totalMinor,
    );
  }
  const categoriesById = new Map(categories.map((category) => [category.id, category]));
  const categoryTotals = [...totalsByCategory.entries()]
    .map(([categoryId, totalMinor]) => ({
      categoryId,
      category: categoryId ? (categoriesById.get(categoryId) ?? null) : null,
      totalMinor,
    }))
    .sort((a, b) => b.totalMinor - a.totalMinor);

  const months = [...previousQuery.data, { month, totalMinor: monthTotalMinor, currency }]
    .sort((a, b) => a.month.localeCompare(b.month))
    .slice(-MONTHS_SHOWN);

  return {
    isPending: false,
    reports: {
      month,
      currency,
      months,
      rangeTotalMinor: months.reduce((sum, item) => sum + item.totalMinor, 0),
      monthTotalMinor,
      categoryTotals,
      isPro: planUsage.planId === 'pro',
    },
  };
}
