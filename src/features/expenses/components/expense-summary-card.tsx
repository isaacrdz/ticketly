import { Text, View } from 'react-native';

import { Card } from '@/components/ui/card';
import { IconBadge } from '@/components/ui/icon-badge';
import { formatLongDate } from '@/lib/dates';
import { formatMoney } from '@/lib/money';
import type { Category, Expense } from '../types';
import { DetailRow } from './detail-row';

interface ExpenseSummaryCardProps {
  expense: Expense;
  category: Category | null;
}

export function ExpenseSummaryCard({ expense, category }: ExpenseSummaryCardProps) {
  return (
    <Card className="gap-5 px-6 py-7">
      <View className="items-center gap-3">
        <IconBadge icon={category?.icon ?? 'package'} color={category?.color ?? 'slate'} size="lg" />
        <Text className="text-center font-sans-medium text-2xl text-foreground">
          {expense.merchant}
        </Text>
        <Text
          className="font-mono-bold text-6xl leading-tight text-foreground"
          style={{ fontVariant: ['tabular-nums'] }}
          adjustsFontSizeToFit
          numberOfLines={1}>
          {formatMoney(expense.totalMinor, expense.currency)}
        </Text>
      </View>
      <View className="h-px border-t border-dashed border-border" />
      <View className="gap-4">
        <DetailRow label="Date" value={formatLongDate(expense.purchaseDate)} />
        <DetailRow label="Category" value={category?.name ?? 'Uncategorized'} />
        {expense.taxMinor !== null && (
          <DetailRow label="Tax" value={formatMoney(expense.taxMinor, expense.currency)} />
        )}
        <DetailRow label="Currency" value={expense.currency} />
        {expense.notes && <DetailRow label="Notes" value={expense.notes} />}
      </View>
    </Card>
  );
}
