import { router } from 'expo-router';
import { Pressable, Text, View } from 'react-native';

import { IconBadge } from '@/components/ui/icon-badge';
import { formatMonthDay } from '@/lib/dates';
import { formatMoney } from '@/lib/money';
import type { Category, Expense } from '../types';

interface ExpenseRowProps {
  expense: Expense;
  category: Category | undefined;
}

export function ExpenseRow({ expense, category }: ExpenseRowProps) {
  const amount = formatMoney(expense.totalMinor, expense.currency);
  const categoryName = category?.name ?? 'Uncategorized';
  const secondaryLine = expense.notes ? `${categoryName} · ${expense.notes}` : categoryName;

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`${expense.merchant}, ${categoryName}, ${amount}, ${formatMonthDay(expense.purchaseDate)}`}
      onPress={() => router.push({ pathname: '/expense/[id]', params: { id: expense.id } })}
      className="min-h-[88px] flex-row items-center gap-4 px-5 py-4 active:bg-surface-muted">
      <IconBadge icon={category?.icon ?? 'package'} color={category?.color ?? 'slate'} />
      <View className="flex-1 gap-0.5">
        <Text className="font-sans-medium text-lg text-foreground" numberOfLines={1}>
          {expense.merchant}
        </Text>
        <Text className="font-sans text-base text-muted" numberOfLines={1}>
          {secondaryLine}
        </Text>
      </View>
      <Text
        className="font-mono-bold text-lg text-foreground"
        style={{ fontVariant: ['tabular-nums'] }}>
        {amount}
      </Text>
    </Pressable>
  );
}
