import { useLocalSearchParams } from 'expo-router';

import { ExpenseDetailScreen } from '@/features/expenses/components/expense-detail-screen';

export default function ExpenseDetailRoute() {
  const { id } = useLocalSearchParams<{ id?: string | string[] }>();
  const expenseId = typeof id === 'string' && id.length > 0 ? id : null;

  return <ExpenseDetailScreen expenseId={expenseId} />;
}
