import { useExpenses } from './use-expenses';
import type { Category, Expense, Receipt } from '../types';

export interface ExpenseDetail {
  expense: Expense;
  category: Category | null;
  receipt: Receipt | null;
}

export function useExpense(id: string | null): { isPending: boolean; detail: ExpenseDetail | null } {
  const { data, isPending } = useExpenses();

  if (!data) return { isPending, detail: null };

  const expense = data.expenses.find((item) => item.id === id);
  if (!expense) return { isPending: false, detail: null };

  return {
    isPending: false,
    detail: {
      expense,
      category: data.categories.find((item) => item.id === expense.categoryId) ?? null,
      receipt: data.receipts.find((item) => item.expenseId === expense.id) ?? null,
    },
  };
}
