import { router } from 'expo-router';
import { ScrollView, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { confirmDestructive } from '@/lib/confirm';
import { formatMoney } from '@/lib/money';
import { goBackOrHome } from '@/lib/navigation';
import { useDeleteExpense } from '../hooks/use-delete-expense';
import { useExpense } from '../hooks/use-expense';
import { ExpenseDetailHeader } from './expense-detail-header';
import { ExpenseDetailSkeleton } from './expense-detail-skeleton';
import { ExpenseNotFound } from './expense-not-found';
import { ExpenseSummaryCard } from './expense-summary-card';
import { ReceiptImageCard } from './receipt-image-card';
import { SyncNotice } from './sync-notice';

interface ExpenseDetailScreenProps {
  /** null when the route param was missing or malformed */
  expenseId: string | null;
}

export function ExpenseDetailScreen({ expenseId }: ExpenseDetailScreenProps) {
  const insets = useSafeAreaInsets();
  const { isPending, detail } = useExpense(expenseId);
  const deleteExpense = useDeleteExpense();

  async function handleDelete() {
    if (!detail) return;
    const { expense } = detail;
    const isConfirmed = await confirmDestructive({
      title: 'Delete this expense?',
      message: `${expense.merchant}, ${formatMoney(expense.totalMinor, expense.currency)}`,
      confirmLabel: 'Delete',
    });
    if (!isConfirmed) return;
    deleteExpense.mutate(expense.id);
    goBackOrHome();
  }

  function handleEdit() {
    if (!detail) return;
    router.push({ pathname: '/review', params: { expenseId: detail.expense.id } });
  }

  return (
    <ScrollView
      contentContainerStyle={{
        paddingTop: insets.top + 16,
        paddingHorizontal: 20,
        paddingBottom: insets.bottom + 32,
      }}>
      <View className="gap-5">
        <ExpenseDetailHeader
          onBack={goBackOrHome}
          onEdit={detail ? handleEdit : undefined}
          onDelete={detail ? handleDelete : undefined}
        />
        {isPending && <ExpenseDetailSkeleton />}
        {!isPending && !detail && <ExpenseNotFound />}
        {detail && (
          <>
            <ExpenseSummaryCard expense={detail.expense} category={detail.category} />
            {detail.expense.syncStatus === 'pending' && (
              <SyncNotice message="Saved on this device, waiting to sync" />
            )}
            <ReceiptImageCard merchant={detail.expense.merchant} receipt={detail.receipt} />
          </>
        )}
      </View>
    </ScrollView>
  );
}
