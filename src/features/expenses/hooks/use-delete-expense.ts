import { useMutation, useQueryClient } from '@tanstack/react-query';

import { expensesQueryKey, type ExpensesData } from './use-expenses';

// UI-only for now: the mutation resolves immediately and onSuccess drops the expense from the cache.
// Later, mutationFn becomes a soft delete (deleted_at) plus an outbox row in one local transaction.
export function useDeleteExpense() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (expenseId: string) => expenseId,
    onSuccess: (expenseId) => {
      queryClient.setQueryData<ExpensesData>(expensesQueryKey, (data) =>
        data && {
          ...data,
          expenses: data.expenses.filter((expense) => expense.id !== expenseId),
          receipts: data.receipts.filter((receipt) => receipt.expenseId !== expenseId),
        },
      );
    },
  });
}
